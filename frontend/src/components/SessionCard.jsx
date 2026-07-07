import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  Video,
  User,
  MessageSquare,
  Check,
  X,
  CheckCircle,
  AlertCircle,
  Star,
} from "lucide-react";
import toast from "react-hot-toast";
import {
  acceptSession,
  declineSession,
  completeSession,
  cancelSession,
} from "../api/sessionApi";
import ReviewModal from "./ReviewModal";

const STATUS_STYLES = {
  pending: {
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    label: "Pending",
  },
  accepted: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    label: "Accepted",
  },
  declined: {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    label: "Declined",
  },
  completed: {
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    label: "Completed",
  },
  cancelled: {
    bg: "bg-surface-100",
    text: "text-surface-600",
    border: "border-surface-200",
    label: "Cancelled",
  },
};

const SessionCard = ({ session, viewAs, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reason, setReason] = useState("");

  const otherUser = viewAs === "student" ? session.tutor : session.student;
  const statusStyle = STATUS_STYLES[session.status];

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleAccept = async () => {
    setLoading(true);
    try {
      await acceptSession(session._id);
      toast.success("Session accepted!");
      onUpdate?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to accept");
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async () => {
    setLoading(true);
    try {
      await declineSession(session._id, reason);
      toast.success("Session declined");
      setShowDeclineModal(false);
      setReason("");
      onUpdate?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to decline");
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!confirm("Mark this session as completed?")) return;
    setLoading(true);
    try {
      await completeSession(session._id);
      toast.success("Session marked as completed!");
      onUpdate?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to complete");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      await cancelSession(session._id, reason);
      toast.success("Session cancelled");
      setShowCancelModal(false);
      setReason("");
      onUpdate?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-5 hover:shadow-md transition-shadow">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            {otherUser?.profileImage ? (
              <img
                src={otherUser.profileImage}
                alt={otherUser.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-primary-100 flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">
                  {getInitials(otherUser?.name)}
                </span>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-xs text-surface-400 mb-0.5">
                {viewAs === "student" ? "Tutor" : "Student"}
              </p>
              <h4 className="font-semibold text-surface-900 truncate">
                {otherUser?.name || "Unknown"}
              </h4>
              <p className="text-xs text-surface-500 truncate">
                {otherUser?.department}
              </p>
            </div>
          </div>

          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border} flex-shrink-0`}
          >
            {statusStyle.label}
          </span>
        </div>

        {/* Subject + Topic */}
        <div className="mb-4 pb-4 border-b border-surface-100">
          <div className="flex items-start gap-2 mb-2">
            <BookOpen size={16} className="text-primary-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-surface-400 leading-tight">Subject</p>
              <p className="font-semibold text-surface-900 text-sm">
                {session.subject}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MessageSquare size={16} className="text-primary-500 mt-0.5 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-surface-400 leading-tight">Topic</p>
              <p className="text-sm text-surface-700">{session.topic}</p>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-sm mb-4">
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-surface-400 flex-shrink-0" />
            <span className="text-surface-700 truncate">
              {formatDate(session.scheduledDate)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={14} className="text-surface-400 flex-shrink-0" />
            <span className="text-surface-700">
              {session.scheduledTime} · {session.duration}min
            </span>
          </div>
          <div className="flex items-center gap-2">
            {session.mode === "online" ? (
              <Video size={14} className="text-surface-400 flex-shrink-0" />
            ) : (
              <MapPin size={14} className="text-surface-400 flex-shrink-0" />
            )}
            <span className="text-surface-700 capitalize truncate">
              {session.mode}
              {session.location && ` · ${session.location}`}
            </span>
          </div>
          {session.amount > 0 && (
            <div className="text-surface-700 font-semibold">
              ₦{session.amount.toLocaleString()}
            </div>
          )}
        </div>

        {/* Message */}
        {session.message && (
          <div className="mb-4 p-3 bg-surface-50 rounded-xl">
            <p className="text-xs text-surface-400 mb-1">Message</p>
            <p className="text-sm text-surface-700 leading-relaxed">
              {session.message}
            </p>
          </div>
        )}

        {/* Decline/Cancel reason */}
        {session.status === "declined" && session.declineReason && (
          <div className="mb-4 p-3 bg-red-50 rounded-xl border border-red-100">
            <p className="text-xs text-red-600 mb-1 flex items-center gap-1">
              <AlertCircle size={12} /> Decline reason
            </p>
            <p className="text-sm text-red-700">{session.declineReason}</p>
          </div>
        )}
        {session.status === "cancelled" && session.cancelReason && (
          <div className="mb-4 p-3 bg-surface-100 rounded-xl">
            <p className="text-xs text-surface-500 mb-1">Cancel reason</p>
            <p className="text-sm text-surface-700">{session.cancelReason}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-surface-100">
          {viewAs === "tutor" && session.status === "pending" && (
            <>
              <button
                onClick={handleAccept}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                <Check size={14} />
                Accept
              </button>
              <button
                onClick={() => setShowDeclineModal(true)}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition-colors"
              >
                <X size={14} />
                Decline
              </button>
            </>
          )}

          {viewAs === "tutor" && session.status === "accepted" && (
            <button
              onClick={handleComplete}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <CheckCircle size={14} />
              Mark Complete
            </button>
          )}

          {viewAs === "student" &&
            ["pending", "accepted"].includes(session.status) && (
              <button
                onClick={() => setShowCancelModal(true)}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border border-red-200 text-red-600 rounded-xl text-sm font-medium hover:bg-red-50 disabled:opacity-50 transition-colors"
              >
                <X size={14} />
                Cancel Request
              </button>
            )}

          {/* NEW: Student leaves review on completed unreviewed */}
          {viewAs === "student" &&
            session.status === "completed" &&
            !session.isReviewed && (
              <button
                onClick={() => setShowReviewModal(true)}
                disabled={loading}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-yellow-500 text-white rounded-xl text-sm font-medium hover:bg-yellow-600 disabled:opacity-50 transition-colors"
              >
                <Star size={14} />
                Leave Review
              </button>
            )}

          {/* NEW: Reviewed badge */}
          {viewAs === "student" &&
            session.status === "completed" &&
            session.isReviewed && (
              <div className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-medium">
                <CheckCircle size={14} />
                Reviewed
              </div>
            )}

          {viewAs === "student" && (
            <Link
              to={`/tutor/profile/${session.tutor?._id}`}
              className="flex items-center justify-center gap-1.5 px-3 py-2 border border-surface-200 text-surface-700 rounded-xl text-sm font-medium hover:bg-surface-50 transition-colors"
            >
              <User size={14} />
              Profile
            </Link>
          )}
        </div>
      </div>

      {/* Decline Modal */}
      {showDeclineModal && (
        <ReasonModal
          title="Decline Session"
          description="Let the student know why you're declining (optional)"
          reason={reason}
          setReason={setReason}
          onConfirm={handleDecline}
          onCancel={() => {
            setShowDeclineModal(false);
            setReason("");
          }}
          confirmLabel="Decline Session"
          loading={loading}
        />
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <ReasonModal
          title="Cancel Session"
          description="Let the tutor know why you're cancelling (optional)"
          reason={reason}
          setReason={setReason}
          onConfirm={handleCancel}
          onCancel={() => {
            setShowCancelModal(false);
            setReason("");
          }}
          confirmLabel="Cancel Session"
          loading={loading}
        />
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <ReviewModal
          session={session}
          onClose={() => setShowReviewModal(false)}
          onSuccess={onUpdate}
        />
      )}
    </>
  );
};

const ReasonModal = ({
  title,
  description,
  reason,
  setReason,
  onConfirm,
  onCancel,
  confirmLabel,
  loading,
}) => (
  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scale-in">
      <h3 className="text-lg font-bold text-surface-900 mb-2">{title}</h3>
      <p className="text-sm text-surface-500 mb-4">{description}</p>
      <textarea
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason (optional)"
        rows={3}
        maxLength={300}
        className="w-full px-3 py-2 border border-surface-200 rounded-xl text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
      />
      <div className="flex gap-2 mt-4">
        <button
          onClick={onCancel}
          disabled={loading}
          className="flex-1 px-4 py-2 border border-surface-200 text-surface-700 rounded-xl text-sm font-medium hover:bg-surface-50 transition-colors disabled:opacity-50"
        >
          Keep
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Please wait..." : confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default SessionCard;