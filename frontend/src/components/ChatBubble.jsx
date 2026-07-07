import { useAuth } from "../context/AuthContext";

const ChatBubble = ({ message }) => {
  const { user } = useAuth();

  const isOwn = message.sender._id === user?._id ||
                 message.sender._id?.toString() === user?._id?.toString();

  const formatTime = (dateStr) => {
    return new Date(dateStr).toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={`flex items-end gap-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar */}
      {!isOwn && (
        <div className="flex-shrink-0 mb-1">
          {message.sender.profileImage ? (
            <img
              src={message.sender.profileImage}
              alt={message.sender.name}
              className="w-7 h-7 rounded-full object-cover"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-xs font-bold text-primary-600">
                {message.sender.name?.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Bubble */}
      <div
        className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isOwn
            ? "bg-primary-600 text-white rounded-br-sm"
            : "bg-white text-surface-800 border border-surface-100 rounded-bl-sm shadow-sm"
        }`}
      >
        <p>{message.content}</p>
        <p
          className={`text-xs mt-1 ${
            isOwn ? "text-primary-200 text-right" : "text-surface-400"
          }`}
        >
          {formatTime(message.createdAt)}
          {isOwn && (
            <span className="ml-1">{message.read ? "✓✓" : "✓"}</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default ChatBubble;