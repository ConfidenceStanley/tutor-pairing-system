import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Send,
  MessageSquare,
  Search,
  ArrowLeft,
  Loader2,
  Users,
  Plus,
} from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import ChatBubble from "../components/ChatBubble";
import Loader from "../components/Loader";
import { useAuth } from "../context/AuthContext";
import { connectSocket, getSocket } from "../utils/socket";
import {
  getConversations,
  getMessages,
  markAsRead,
} from "../api/messageApi";
import api from "../api/axios";

const Messages = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileView, setMobileView] = useState("list");
  const [initialLoadDone, setInitialLoadDone] = useState(false);

  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);
  const activeConversationRef = useRef(activeConversation);

  // Keep ref in sync
  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  // ── Scroll to bottom ─────────────────────────────────────────────────────
  const scrollToBottom = useCallback(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // ── Connect socket ────────────────────────────────────────────────────────
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const socket = connectSocket(token);
    socket.emit("join");

    socket.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socket.on("messageReceived", (message) => {
      setMessages((prev) => {
        const alreadyExists = prev.some((m) => m._id === message._id);
        if (alreadyExists) return prev;
        return [...prev, message];
      });

      // Update conversations list
      setConversations((prev) => {
        const senderId = message.sender._id?.toString();
        const receiverId = message.receiver._id?.toString();
        const currentUserId = user?._id?.toString();
        const otherId = senderId === currentUserId ? receiverId : senderId;
        const otherUser =
          senderId === currentUserId ? message.receiver : message.sender;

        const existing = prev.find(
          (c) => c.user._id?.toString() === otherId
        );

        if (existing) {
          return prev.map((c) =>
            c.user._id?.toString() === otherId
              ? {
                  ...c,
                  lastMessage: message,
                  unreadCount:
                    senderId !== currentUserId &&
                    activeConversationRef.current?._id?.toString() !== otherId
                      ? c.unreadCount + 1
                      : c.unreadCount,
                }
              : c
          );
        } else {
          return [
            { user: otherUser, lastMessage: message, unreadCount: 1 },
            ...prev,
          ];
        }
      });
    });

    socket.on("typing", ({ senderId, isTyping: typing }) => {
      if (
        activeConversationRef.current?._id?.toString() === senderId?.toString()
      ) {
        setIsTyping(typing);
      }
    });

    return () => {
      socket.off("onlineUsers");
      socket.off("messageReceived");
      socket.off("typing");
    };
  }, [user]);

  // ── Load conversations ────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        setLoadingConversations(true);
        const res = await getConversations();
        setConversations(res.data || []);
      } catch {
        toast.error("Failed to load conversations");
      } finally {
        setLoadingConversations(false);
        setInitialLoadDone(true);
      }
    };
    load();
  }, []);

  // ── Handle ?with=userId — auto-open or create new conversation ───────────
  useEffect(() => {
    if (!initialLoadDone) return;

    const withUserId = searchParams.get("with");
    if (!withUserId) return;

    // Check if we already have a conversation with this user
    const existing = conversations.find(
      (c) => c.user._id?.toString() === withUserId
    );

    if (existing) {
      openConversation(existing.user);
      // Clear the param so it doesn't re-trigger
      setSearchParams({}, { replace: true });
    } else {
      // Fetch the user's info and start a new conversation
      const fetchUser = async () => {
        try {
          // Try tutor profile first, then generic
          const res = await api.get(`/profile/tutor/${withUserId}`);
          const otherUser = res.data.data;

          if (otherUser) {
            const newConvUser = {
              _id: otherUser._id,
              name: otherUser.name,
              profileImage: otherUser.profileImage || "",
              role: otherUser.role || "tutor",
            };

            // Add to conversations list if not already there
            setConversations((prev) => {
              const alreadyExists = prev.some(
                (c) => c.user._id?.toString() === withUserId
              );
              if (alreadyExists) return prev;
              return [
                { user: newConvUser, lastMessage: null, unreadCount: 0 },
                ...prev,
              ];
            });

            openConversation(newConvUser);
          }
        } catch {
          toast.error("Could not find that user");
        }
        setSearchParams({}, { replace: true });
      };
      fetchUser();
    }
  }, [initialLoadDone, searchParams]);

  // ── Open conversation ─────────────────────────────────────────────────────
  const openConversation = async (otherUser) => {
    setActiveConversation(otherUser);
    setMobileView("chat");
    setIsTyping(false);
    setMessages([]);

    try {
      setLoadingMessages(true);
      const res = await getMessages(otherUser._id);
      setMessages(res.data?.messages || []);

      await markAsRead(otherUser._id);

      setConversations((prev) =>
        prev.map((c) =>
          c.user._id?.toString() === otherUser._id?.toString()
            ? { ...c, unreadCount: 0 }
            : c
        )
      );
    } catch {
      toast.error("Failed to load messages");
    } finally {
      setLoadingMessages(false);
      setTimeout(() => inputRef.current?.focus(), 200);
    }
  };

  // ── Send message via socket ───────────────────────────────────────────────
  const handleSend = () => {
    const content = inputValue.trim();
    if (!content || !activeConversation || sending) return;

    const socket = getSocket();
    if (!socket?.connected) {
      toast.error("Connection lost. Reconnecting...");
      const token = localStorage.getItem("token");
      if (token) connectSocket(token);
      return;
    }

    setSending(true);
    socket.emit("sendMessage", {
      receiverId: activeConversation._id,
      content,
    });

    setInputValue("");
    setSending(false);

    socket.emit("typing", {
      receiverId: activeConversation._id,
      isTyping: false,
    });
  };

  // ── Typing indicator ──────────────────────────────────────────────────────
  const handleInputChange = (e) => {
    setInputValue(e.target.value);

    const socket = getSocket();
    if (!socket?.connected || !activeConversation) return;

    socket.emit("typing", {
      receiverId: activeConversation._id,
      isTyping: true,
    });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", {
        receiverId: activeConversation._id,
        isTyping: false,
      });
    }, 1500);
  };

  // ── Handle Enter key ──────────────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Back to list (mobile) ─────────────────────────────────────────────────
  const handleBackToList = () => {
    setMobileView("list");
    setActiveConversation(null);
    setMessages([]);
    setIsTyping(false);
  };

  // ── Helpers ───────────────────────────────────────────────────────────────
  const filteredConversations = conversations.filter((c) =>
    c.user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = conversations.reduce(
    (sum, c) => sum + (c.unreadCount || 0),
    0
  );

  const isOnline = (userId) => onlineUsers.includes(userId?.toString());

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString("en-NG", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return date.toLocaleDateString("en-NG", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
      });
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-surface-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Page Header with Back Button */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate(-1)}
                className="p-2 rounded-xl hover:bg-white border border-surface-200 text-surface-600 hover:text-primary-600 transition-colors"
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-surface-900 flex items-center gap-2">
                  <MessageSquare size={24} className="text-primary-600" />
                  Messages
                  {totalUnread > 0 && (
                    <span className="ml-1 bg-primary-600 text-white text-xs font-bold px-2.5 py-0.5 rounded-full">
                      {totalUnread}
                    </span>
                  )}
                </h1>
                <p className="text-surface-500 text-sm mt-0.5">
                  Chat with your {user?.role === "student" ? "tutors" : "students"}
                </p>
              </div>
            </div>

            <button
              onClick={() => navigate("/tutors")}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              <Plus size={16} />
              New Chat
            </button>
          </div>

          {/* Chat Container */}
          <div
            className="bg-white rounded-2xl border border-surface-100 shadow-sm overflow-hidden"
            style={{ height: "calc(100vh - 200px)", minHeight: "500px" }}
          >
            <div className="flex h-full">
              {/* ── Sidebar: Conversation List ──────────────────────────── */}
              <div
                className={`
                  w-full md:w-96 flex-shrink-0 border-r border-surface-100 flex flex-col bg-white
                  ${mobileView === "chat" ? "hidden md:flex" : "flex"}
                `}
              >
                {/* Sidebar Header */}
                <div className="p-4 border-b border-surface-100">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="font-semibold text-surface-900 text-base">
                      Conversations
                    </h2>
                    <span className="text-xs text-surface-400">
                      {conversations.length}{" "}
                      {conversations.length === 1 ? "chat" : "chats"}
                    </span>
                  </div>
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"
                    />
                    <input
                      type="text"
                      placeholder="Search by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Conversation Items */}
                <div className="flex-1 overflow-y-auto">
                  {loadingConversations ? (
                    <div className="flex flex-col items-center justify-center h-48 gap-2">
                      <Loader2
                        size={24}
                        className="animate-spin text-primary-500"
                      />
                      <p className="text-sm text-surface-400">
                        Loading conversations...
                      </p>
                    </div>
                  ) : filteredConversations.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center py-12">
                      <div className="w-16 h-16 bg-primary-50 rounded-2xl flex items-center justify-center">
                        <Users size={28} className="text-primary-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-surface-700 mb-1">
                          {searchQuery
                            ? "No conversations found"
                            : "No conversations yet"}
                        </p>
                        <p className="text-sm text-surface-400 leading-relaxed">
                          {searchQuery
                            ? "Try a different search term"
                            : "Visit a tutor's profile and click \"Send Message\" to start chatting"}
                        </p>
                      </div>
                      {!searchQuery && (
                        <button
                          onClick={() => navigate("/tutors")}
                          className="flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
                        >
                          <Search size={14} />
                          Find Tutors
                        </button>
                      )}
                    </div>
                  ) : (
                    filteredConversations.map((conv) => {
                      const isActive =
                        activeConversation?._id?.toString() ===
                        conv.user._id?.toString();
                      const online = isOnline(conv.user._id);

                      return (
                        <button
                          key={conv.user._id}
                          onClick={() => openConversation(conv.user)}
                          className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-all border-b border-surface-50 ${
                            isActive
                              ? "bg-primary-50 border-l-3 border-l-primary-500"
                              : "hover:bg-surface-50"
                          }`}
                        >
                          {/* Avatar */}
                          <div className="relative flex-shrink-0">
                            {conv.user.profileImage ? (
                              <img
                                src={conv.user.profileImage}
                                alt={conv.user.name}
                                className={`w-12 h-12 rounded-full object-cover ${
                                  isActive
                                    ? "ring-2 ring-primary-300"
                                    : ""
                                }`}
                              />
                            ) : (
                              <div
                                className={`w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center ${
                                  isActive
                                    ? "ring-2 ring-primary-300"
                                    : ""
                                }`}
                              >
                                <span className="text-sm font-bold text-white">
                                  {getInitials(conv.user.name)}
                                </span>
                              </div>
                            )}
                            {online && (
                              <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-success rounded-full border-2 border-white" />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-0.5">
                              <p
                                className={`text-sm font-semibold truncate ${
                                  isActive
                                    ? "text-primary-700"
                                    : "text-surface-900"
                                }`}
                              >
                                {conv.user.name}
                              </p>
                              <span className="text-xs text-surface-400 flex-shrink-0 ml-2">
                                {formatTime(conv.lastMessage?.createdAt)}
                              </span>
                            </div>

                            <p className="text-xs text-surface-500 capitalize mb-1">
                              {conv.user.role}
                            </p>

                            <div className="flex items-center justify-between">
                              <p className="text-xs text-surface-400 truncate pr-2">
                                {conv.lastMessage
                                  ? `${
                                      conv.lastMessage.sender._id?.toString() ===
                                      user?._id?.toString()
                                        ? "You: "
                                        : ""
                                    }${conv.lastMessage.content}`
                                  : "Start a conversation..."}
                              </p>
                              {conv.unreadCount > 0 && (
                                <span className="flex-shrink-0 bg-primary-600 text-white text-xs font-bold min-w-[20px] h-5 px-1.5 rounded-full flex items-center justify-center">
                                  {conv.unreadCount > 9
                                    ? "9+"
                                    : conv.unreadCount}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Mobile: Find Tutors button at bottom */}
                <div className="p-3 border-t border-surface-100 sm:hidden">
                  <button
                    onClick={() => navigate("/tutors")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors"
                  >
                    <Plus size={16} />
                    Start New Chat
                  </button>
                </div>
              </div>

              {/* ── Main: Chat Window ────────────────────────────────────── */}
              <div
                className={`
                  flex-1 flex flex-col bg-surface-50
                  ${mobileView === "list" ? "hidden md:flex" : "flex"}
                `}
              >
                {activeConversation ? (
                  <>
                    {/* Chat Header */}
                    <div className="flex items-center gap-3 px-5 py-4 border-b border-surface-100 bg-white">
                      <button
                        onClick={handleBackToList}
                        className="md:hidden p-2 rounded-xl hover:bg-surface-50 text-surface-600 transition-colors"
                      >
                        <ArrowLeft size={18} />
                      </button>

                      <div className="relative flex-shrink-0">
                        {activeConversation.profileImage ? (
                          <img
                            src={activeConversation.profileImage}
                            alt={activeConversation.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                            <span className="text-sm font-bold text-white">
                              {getInitials(activeConversation.name)}
                            </span>
                          </div>
                        )}
                        {isOnline(activeConversation._id) && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full border-2 border-white" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-surface-900 truncate text-sm">
                          {activeConversation.name}
                        </p>
                        <p className="text-xs text-surface-500">
                          {isTyping ? (
                            <span className="text-primary-500 font-medium">
                              typing...
                            </span>
                          ) : isOnline(activeConversation._id) ? (
                            <span className="text-success font-medium flex items-center gap-1">
                              <span className="w-1.5 h-1.5 bg-success rounded-full" />
                              Online
                            </span>
                          ) : (
                            <span className="capitalize">
                              {activeConversation.role} · Offline
                            </span>
                          )}
                        </p>
                      </div>

                      {/* View profile link */}
                      {activeConversation.role === "tutor" && (
                        <button
                          onClick={() =>
                            navigate(
                              `/tutor/profile/${activeConversation._id}`
                            )
                          }
                          className="text-xs text-primary-600 font-medium hover:text-primary-700 px-3 py-1.5 rounded-lg hover:bg-primary-50 transition-colors"
                        >
                          View Profile
                        </button>
                      )}
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-3">
                      {loadingMessages ? (
                        <div className="flex flex-col items-center justify-center h-full gap-3">
                          <Loader2
                            size={24}
                            className="animate-spin text-primary-500"
                          />
                          <p className="text-sm text-surface-400">
                            Loading messages...
                          </p>
                        </div>
                      ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
                          <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center">
                            <MessageSquare
                              size={32}
                              className="text-primary-400"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-surface-700 mb-1">
                              Start the conversation
                            </p>
                            <p className="text-sm text-surface-400 leading-relaxed max-w-sm">
                              Send a message to{" "}
                              <span className="font-medium text-primary-600">
                                {activeConversation.name}
                              </span>
                              . Say hello, ask about a subject, or discuss
                              scheduling!
                            </p>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Date separator for first message */}
                          {messages.length > 0 && (
                            <div className="flex items-center gap-3 my-2">
                              <div className="flex-1 border-t border-surface-200" />
                              <span className="text-xs text-surface-400 bg-surface-50 px-2">
                                {new Date(
                                  messages[0].createdAt
                                ).toLocaleDateString("en-NG", {
                                  weekday: "long",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </span>
                              <div className="flex-1 border-t border-surface-200" />
                            </div>
                          )}

                          {messages.map((msg) => (
                            <ChatBubble key={msg._id} message={msg} />
                          ))}

                          {/* Typing indicator */}
                          {isTyping && (
                            <div className="flex items-end gap-2">
                              <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                                <span className="text-xs font-bold text-primary-600">
                                  {activeConversation.name
                                    ?.charAt(0)
                                    .toUpperCase()}
                                </span>
                              </div>
                              <div className="bg-white border border-surface-100 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                                <div className="flex gap-1.5 items-center">
                                  <span
                                    className="w-2 h-2 bg-surface-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "0ms" }}
                                  />
                                  <span
                                    className="w-2 h-2 bg-surface-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "150ms" }}
                                  />
                                  <span
                                    className="w-2 h-2 bg-surface-400 rounded-full animate-bounce"
                                    style={{ animationDelay: "300ms" }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                          <div ref={messagesEndRef} />
                        </>
                      )}
                    </div>

                    {/* Message Input */}
                    <div className="px-4 sm:px-5 py-4 border-t border-surface-100 bg-white">
                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <textarea
                            ref={inputRef}
                            value={inputValue}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            placeholder={`Message ${activeConversation.name}...`}
                            rows={1}
                            className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none leading-relaxed placeholder:text-surface-400"
                            style={{ maxHeight: "120px", overflowY: "auto" }}
                            onInput={(e) => {
                              e.target.style.height = "auto";
                              e.target.style.height =
                                Math.min(e.target.scrollHeight, 120) + "px";
                            }}
                          />
                        </div>
                        <button
                          onClick={handleSend}
                          disabled={!inputValue.trim() || sending}
                          className="flex-shrink-0 w-11 h-11 bg-primary-600 text-white rounded-xl flex items-center justify-center hover:bg-primary-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                        >
                          {sending ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Send size={18} />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-surface-400 mt-2 text-center hidden sm:block">
                        Press <kbd className="px-1.5 py-0.5 bg-surface-100 rounded text-xs font-mono">Enter</kbd> to send · <kbd className="px-1.5 py-0.5 bg-surface-100 rounded text-xs font-mono">Shift+Enter</kbd> for new line
                      </p>
                    </div>
                  </>
                ) : (
                  /* Empty state — no conversation selected (desktop only) */
                  <div className="flex flex-col items-center justify-center h-full gap-5 text-center px-8">
                    <div className="w-24 h-24 bg-primary-50 rounded-3xl flex items-center justify-center">
                      <MessageSquare size={40} className="text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-surface-800 mb-2">
                        Your Messages
                      </h3>
                      <p className="text-sm text-surface-400 max-w-sm leading-relaxed">
                        Select a conversation from the left to start chatting, or
                        visit a tutor's profile to begin a new conversation.
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/tutors")}
                      className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 transition-colors shadow-sm"
                    >
                      <Search size={16} />
                      Browse Tutors
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Messages;