import { useState } from "react";
import { X, Send, Star } from "lucide-react";
import toast from "react-hot-toast";
import StarRating from "./StarRating";
import { createReview } from "../api/reviewApi";

const ReviewModal = ({ session, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const tutor = session.tutor;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setSubmitting(true);
    try {
      await createReview({
        sessionId: session._id,
        rating,
        comment,
      });
      toast.success("Review submitted! Thank you.");
      onSuccess?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
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

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-surface-100 sticky top-0 bg-white rounded-t-2xl">
          <h3 className="text-lg font-bold text-surface-900">
            Rate Your Session
          </h3>
          <button
            onClick={onClose}
            disabled={submitting}
            className="p-2 rounded-xl hover:bg-surface-100 text-surface-500 transition-colors disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Tutor info */}
          <div className="flex items-center gap-3 mb-6 p-4 bg-surface-50 rounded-xl">
            {tutor?.profileImage ? (
              <img
                src={tutor.profileImage}
                alt={tutor.name}
                className="w-12 h-12 rounded-full object-cover ring-2 ring-white"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {getInitials(tutor?.name)}
                </span>
              </div>
            )}
            <div className="min-w-0">
              <p className="font-semibold text-surface-900 truncate">
                {tutor?.name}
              </p>
              <p className="text-xs text-surface-500 truncate">
                {session.subject} · {session.topic}
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-5">
            <label className="block text-sm font-medium text-surface-700 mb-3">
              How would you rate this session? *
            </label>
            <div className="flex justify-center py-3">
              <StarRating
                value={rating}
                onChange={setRating}
                size={36}
                interactive
                showLabel
              />
            </div>
          </div>

          {/* Comment */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Share your experience (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder="What did you like? What could be improved?"
              className="w-full px-4 py-3 border border-surface-200 rounded-xl text-sm text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
            <p className="text-xs text-surface-400 mt-1 text-right">
              {comment.length}/500
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="flex-1 px-4 py-2.5 border border-surface-200 text-surface-700 rounded-xl text-sm font-medium hover:bg-surface-50 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || rating === 0}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={14} />
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;