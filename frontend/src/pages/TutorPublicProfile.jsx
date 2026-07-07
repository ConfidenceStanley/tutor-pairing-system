import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  MapPin,
  GraduationCap,
  BookOpen,
  Clock,
  Calendar,
  MessageSquare,
  ArrowLeft,
  Award,
} from "lucide-react";
import Navbar from "../components/Navbar";
import StarRating from "../components/StarRating";
import { getTutor } from "../api/tutorApi";
import { getTutorReviews } from "../api/reviewApi";
import { useAuth } from "../context/AuthContext";

const TutorPublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tutor, setTutor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [tutorRes, reviewsRes] = await Promise.all([
          getTutor(id),
          getTutorReviews(id),
        ]);
        setTutor(tutorRes.data);
        setReviews(reviewsRes.data);
        setStats(reviewsRes.stats);
      } catch (err) {
        setError(err.response?.data?.message || "Tutor not found");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-surface-50 flex items-center justify-center">
          <p className="text-surface-500">Loading profile...</p>
        </div>
      </>
    );
  }

  if (error || !tutor) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold text-surface-900 mb-2">
              Tutor not found
            </h2>
            <p className="text-surface-500 mb-6">{error}</p>
            <Link
              to="/tutors"
              className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700"
            >
              Browse Tutors
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Reviews stats
  const totalReviews = stats?.totalReviews || 0;
  const averageRating = stats?.averageRating || 0;
  const breakdown = stats?.breakdown || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-surface-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-surface-600 hover:text-primary-600 mb-6 text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT: Profile card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-6 sticky top-8">
                <div className="text-center mb-5">
                  {tutor.profileImage ? (
                    <img
                      src={tutor.profileImage}
                      alt={tutor.name}
                      className="w-28 h-28 rounded-full object-cover mx-auto ring-4 ring-primary-100 mb-4"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center mx-auto ring-4 ring-primary-100 mb-4">
                      <span className="text-white text-2xl font-bold">
                        {getInitials(tutor.name)}
                      </span>
                    </div>
                  )}
                  <h1 className="text-xl font-bold text-surface-900">
                    {tutor.name}
                  </h1>

                  <div className="flex items-center justify-center gap-1 mt-1 text-sm text-surface-500">
                    <MapPin size={12} />
                    <span>{tutor.department}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-0.5 text-sm text-surface-500">
                    <GraduationCap size={12} />
                    <span>{tutor.level}</span>
                  </div>

                  {averageRating > 0 && (
                    <div className="flex items-center justify-center gap-2 mt-3">
                      <StarRating value={averageRating} size={16} />
                      <span className="text-sm font-semibold text-surface-700">
                        {averageRating.toFixed(1)}
                      </span>
                      <span className="text-sm text-surface-400">
                        ({totalReviews})
                      </span>
                    </div>
                  )}
                </div>

                {/* Rate */}
                {tutor.sessionRate > 0 && (
                  <div className="pt-4 border-t border-surface-100 mb-4 text-center">
                    <p className="text-xs text-surface-400 mb-1">
                      Session Rate
                    </p>
                    <p className="text-2xl font-bold text-surface-900">
                      ₦{tutor.sessionRate.toLocaleString()}
                      <span className="text-sm text-surface-400 font-normal">
                        /hour
                      </span>
                    </p>
                  </div>
                )}

                {/* Book button */}
                {user?.role === "student" && (
                  <Link
                    to={`/book-session/${tutor._id}`}
                    className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                  >
                    <Calendar size={16} />
                    Book Session
                  </Link>
                )}
                {!user && (
                  <Link
                    to="/login"
                    className="w-full flex items-center justify-center gap-2 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-colors"
                  >
                    <Calendar size={16} />
                    Login to Book
                  </Link>
                )}
              </div>
            </div>

            {/* RIGHT: Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio */}
              {tutor.bio && (
                <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-6">
                  <h3 className="font-bold text-surface-900 mb-3 flex items-center gap-2">
                    <Award size={18} className="text-primary-500" />
                    About
                  </h3>
                  <p className="text-surface-700 leading-relaxed whitespace-pre-line">
                    {tutor.bio}
                  </p>
                </div>
              )}

              {/* Subjects */}
              {tutor.subjects?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-6">
                  <h3 className="font-bold text-surface-900 mb-3 flex items-center gap-2">
                    <BookOpen size={18} className="text-primary-500" />
                    Subjects Taught
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {tutor.subjects.map((s, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 text-sm font-medium px-3 py-1.5 rounded-full"
                      >
                        <BookOpen size={12} />
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability */}
              {tutor.availability?.length > 0 && (
                <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-6">
                  <h3 className="font-bold text-surface-900 mb-3 flex items-center gap-2">
                    <Clock size={18} className="text-primary-500" />
                    Availability
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {tutor.availability.map((slot, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-3 bg-surface-50 rounded-xl"
                      >
                        <span className="font-medium text-surface-900 text-sm">
                          {slot.day}
                        </span>
                        <span className="text-sm text-surface-600">
                          {slot.startTime} – {slot.endTime}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-6">
                <h3 className="font-bold text-surface-900 mb-4 flex items-center gap-2">
                  <Star size={18} className="text-primary-500" />
                  Reviews
                  {totalReviews > 0 && (
                    <span className="text-sm font-normal text-surface-400">
                      ({totalReviews})
                    </span>
                  )}
                </h3>

                {totalReviews === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-3">
                      <Star size={28} className="text-surface-300" />
                    </div>
                    <p className="text-surface-500 text-sm">
                      No reviews yet. Be the first to review!
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Rating summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6 pb-6 border-b border-surface-100">
                      {/* Big rating */}
                      <div className="text-center sm:text-left">
                        <div className="text-5xl font-bold text-surface-900 mb-1">
                          {averageRating.toFixed(1)}
                        </div>
                        <StarRating value={averageRating} size={18} />
                        <p className="text-sm text-surface-500 mt-1">
                          Based on {totalReviews}{" "}
                          {totalReviews === 1 ? "review" : "reviews"}
                        </p>
                      </div>

                      {/* Breakdown bars */}
                      <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count = breakdown[star] || 0;
                          const percent =
                            totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                          return (
                            <div
                              key={star}
                              className="flex items-center gap-2 text-sm"
                            >
                              <span className="text-surface-600 w-6">
                                {star}★
                              </span>
                              <div className="flex-1 h-2 bg-surface-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-400 rounded-full transition-all"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                              <span className="text-surface-500 w-8 text-right">
                                {count}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Individual reviews */}
                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div
                          key={review._id}
                          className="p-4 bg-surface-50 rounded-xl"
                        >
                          <div className="flex items-start gap-3">
                            {review.student?.profileImage ? (
                              <img
                                src={review.student.profileImage}
                                alt={review.student.name}
                                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-xs font-bold">
                                  {getInitials(review.student?.name)}
                                </span>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <p className="font-semibold text-surface-900 text-sm truncate">
                                  {review.student?.name || "Anonymous"}
                                </p>
                                <span className="text-xs text-surface-400 flex-shrink-0">
                                  {formatDate(review.createdAt)}
                                </span>
                              </div>
                              <StarRating value={review.rating} size={12} />
                              {review.comment && (
                                <p className="mt-2 text-sm text-surface-700 leading-relaxed">
                                  {review.comment}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TutorPublicProfile;