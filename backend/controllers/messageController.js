const Message = require("../models/Message");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const mongoose = require("mongoose");

// GET /api/messages/conversations
// Returns list of unique conversation partners with last message + unread count
const getConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Find all messages where user is sender or receiver
  const messages = await Message.find({
    $or: [{ sender: userId }, { receiver: userId }],
  })
    .sort({ createdAt: -1 })
    .populate("sender", "name profileImage role")
    .populate("receiver", "name profileImage role");

  // Build unique conversation map keyed by the other user's id
  const conversationMap = new Map();

  for (const msg of messages) {
    const otherUser =
      msg.sender._id.toString() === userId.toString()
        ? msg.receiver
        : msg.sender;

    const otherId = otherUser._id.toString();

    if (!conversationMap.has(otherId)) {
      conversationMap.set(otherId, {
        user: otherUser,
        lastMessage: msg,
        unreadCount: 0,
      });
    }

    // Count unread messages sent TO current user FROM this conversation partner
    if (
      msg.receiver._id.toString() === userId.toString() &&
      !msg.read
    ) {
      const existing = conversationMap.get(otherId);
      existing.unreadCount += 1;
    }
  }

  const conversations = Array.from(conversationMap.values());

  res.json({
    success: true,
    data: conversations,
    message: "Conversations retrieved",
  });
});

// GET /api/messages/:userId
// Get all messages between current user and userId
const getMessages = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  const otherUser = await User.findById(userId).select(
    "name profileImage role department"
  );
  if (!otherUser) {
    res.status(404);
    throw new Error("User not found");
  }

  const messages = await Message.find({
    $or: [
      { sender: currentUserId, receiver: userId },
      { sender: userId, receiver: currentUserId },
    ],
  })
    .sort({ createdAt: 1 })
    .populate("sender", "name profileImage")
    .populate("receiver", "name profileImage");

  res.json({
    success: true,
    data: { messages, otherUser },
    message: "Messages retrieved",
  });
});

// POST /api/messages
// Send a message (HTTP fallback — primary sending goes through socket)
const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId, content } = req.body;

  if (!receiverId || !content || !content.trim()) {
    res.status(400);
    throw new Error("Receiver and content are required");
  }

  if (!mongoose.Types.ObjectId.isValid(receiverId)) {
    res.status(400);
    throw new Error("Invalid receiver ID");
  }

  const receiver = await User.findById(receiverId);
  if (!receiver) {
    res.status(404);
    throw new Error("Receiver not found");
  }

  if (receiverId === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot send a message to yourself");
  }

  const message = await Message.create({
    sender: req.user._id,
    receiver: receiverId,
    content: content.trim(),
  });

  const populated = await Message.findById(message._id)
    .populate("sender", "name profileImage")
    .populate("receiver", "name profileImage");

  res.status(201).json({
    success: true,
    data: populated,
    message: "Message sent",
  });
});

// PUT /api/messages/read/:userId
// Mark all messages from userId to current user as read
const markAsRead = asyncHandler(async (req, res) => {
  const currentUserId = req.user._id;
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    res.status(400);
    throw new Error("Invalid user ID");
  }

  await Message.updateMany(
    { sender: userId, receiver: currentUserId, read: false },
    { read: true }
  );

  res.json({
    success: true,
    data: null,
    message: "Messages marked as read",
  });
});

module.exports = {
  getConversations,
  getMessages,
  sendMessage,
  markAsRead,
};