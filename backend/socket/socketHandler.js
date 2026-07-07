const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Message = require("../models/Message");

// Map: userId (string) → socketId (string)
const onlineUsers = new Map();

const socketHandler = (io) => {
  // Authenticate every socket connection via JWT
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers?.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication error: No token"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user._id.toString();

    // Register user as online
    onlineUsers.set(userId, socket.id);

    // Broadcast updated online users list
    io.emit("onlineUsers", Array.from(onlineUsers.keys()));

    // ── join ──────────────────────────────────────────────────────────────
    socket.on("join", (data) => {
      // Optionally join a room named after the user id
      socket.join(userId);
    });

    // ── sendMessage ───────────────────────────────────────────────────────
    socket.on("sendMessage", async (data) => {
      try {
        const { receiverId, content } = data;

        if (!receiverId || !content || !content.trim()) return;

        const receiver = await User.findById(receiverId);
        if (!receiver) return;

        // Save to database
        const message = await Message.create({
          sender: socket.user._id,
          receiver: receiverId,
          content: content.trim(),
        });

        const populated = await Message.findById(message._id)
          .populate("sender", "name profileImage")
          .populate("receiver", "name profileImage");

        // Emit back to sender (confirm delivery)
        socket.emit("messageReceived", populated);

        // Emit to receiver if online
        const receiverSocketId = onlineUsers.get(receiverId.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("messageReceived", populated);
        }
      } catch (err) {
        socket.emit("messageError", { message: "Failed to send message" });
      }
    });

    // ── typing ────────────────────────────────────────────────────────────
    socket.on("typing", ({ receiverId, isTyping }) => {
      const receiverSocketId = onlineUsers.get(receiverId?.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", {
          senderId: userId,
          isTyping,
        });
      }
    });

    // ── disconnect ────────────────────────────────────────────────────────
    socket.on("disconnect", () => {
      onlineUsers.delete(userId);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });
  });
};

module.exports = socketHandler;