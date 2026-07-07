import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Star,
  MapPin,
  Clock,
  BookOpen,
  Calendar,
  Award,
  ArrowLeft,
  MessageSquare,
  GraduationCap,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import { getTutorProfile } from "../api/profileApi";
import { useAuth } from "../context/AuthContext";
import MainLayout from "../layouts/MainLayout";

// Reusable star display
const StarDisplay = ({ rating, size = 16 }) => {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "text-surface-300"
          }
        />
      ))}
    </div>
  );
};

// Day order for sorting
const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TutorPublicProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tutor, setTutor] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const response = await getTutorProfile(id);
        setTutor(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load tutor profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTutor();
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

  // Sort availability by day order
  const sortedAvailability = tutor?.availability
    ? [...tutor.availability].sort(
        (a, b) => DAY_ORDER.indexOf(a.day) - DAY_ORDER.indexOf(b.day)
      )
    : [];

  // Group availability by day
  const groupedAvailability = {};
  sortedAvailability.forEach((slot) => {
    if (!groupedAvailability[slot.day]) groupedAvailability[slot.day] = [];
    groupedAvailability[slot.day].push(slot);
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
            <p className="text-surface-500">Loading tutor profile...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users size={32} className="text-danger" />
          </div>
          <h2 className="text-2xl font-bold text-surface-800 mb-2">
            Tutor Not Found
          </h2>
          <p className="text-surface-500 mb-6">{error}</p>
          <button
            onClick={() => navigate("/tutors")}
            className="px-6 py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
          >
            Browse Tutors
          </button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto animate-fade-in-up">
        {/* Back Button */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-surface-500 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-5">
            {/* Main Profile Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-6 text-center">
              {/* Avatar */}
              <div className="flex justify-center mb-4">
                {tutor.profileImage ? (
                  <img
                    src={tutor.profileImage}
                    alt={tutor.name}
                    className="w-28 h-28 rounded-full object-cover border-4 border-primary-100 shadow-md"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center border-4 border-primary-100 shadow-md">
                    <span className="text-3xl font-bold text-white">
                      {getInitials(tutor.name)}
                    </span>
                  </div>
                )}
              </div>

              {/* Name and Role */}
              <h1 className="text-xl font-bold text-surface-900">{tutor.name}</h1>
              <div className="flex items-center justify-center gap-1.5 mt-1 text-surface-500 text-sm">
                <GraduationCap size={14} />
                <span>
                  {tutor.department} • {tutor.level}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <StarDisplay rating={tutor.averageRating} size={18} />
                <span className="font-semibold text-surface-800">
                  {tutor.averageRating > 0
                    ? tutor.averageRating.toFixed(1)
                    : "New"}
                </span>
                <span className="text-surface-400 text-sm">
                  ({tutor.totalReviews} review
                  {tutor.totalReviews !== 1 ? "s" : ""})
                </span>
              </div>

              {/* Session Rate */}
              <div className="mt-4 p-3 bg-primary-50 rounded-xl">
                <p className="text-xs text-primary-600 font-medium uppercase tracking-wide">
                  Session Rate
                </p>
                <p className="text-2xl font-bold text-primary-700 mt-0.5">
                  {tutor.sessionRate > 0
                    ? `₦${tutor.sessionRate.toLocaleString()}`
                    : "Free"}
                </p>
                <p className="text-xs text-primary-500 mt-0.5">per session</p>
              </div>

              {/* Book Session Button */}
              {user ? (
                user.role === "student" ? (
                  <Link
                    to={`/book-session/${tutor._id}`}
                    className="mt-4 block w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all duration-200 shadow-sm text-center"
                  >
                    Book a Session
                  </Link>
                ) : (
                  <div className="mt-4 p-3 bg-surface-50 rounded-xl text-center">
                    <p className="text-surface-400 text-sm">
                      Only students can book sessions
                    </p>
                  </div>
                )
              ) : (
                <Link
                  to="/login"
                  className="mt-4 block w-full py-3 bg-primary-600 text-white rounded-xl font-semibold hover:bg-primary-700 transition-all duration-200 shadow-sm text-center"
                >
                  Login to Book
                </Link>
              )}
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-5">
              <h2 className="font-semibold text-surface-800 mb-4">
                Quick Stats
              </h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-amber-100 rounded-lg flex items-center justify-center">
                    <Award size={18} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs text-surface-400">Rating</p>
                    <p className="text-sm font-semibold text-surface-800">
                      {tutor.averageRating > 0
                        ? `${tutor.averageRating.toFixed(1)} / 5.0`
                        : "Not yet rated"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MessageSquare size={18} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs text-surface-400">Total Reviews</p>
                    <p className="text-sm font-semibold text-surface-800">
                      {tutor.totalReviews} review
                      {tutor.totalReviews !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BookOpen size={18} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs text-surface-400">Subjects</p>
                    <p className="text-sm font-semibold text-surface-800">
                      {tutor.subjects.length} subject
                      {tutor.subjects.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-5">
            {/* Bio */}
            {tutor.bio && (
              <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-6">
                <h2 className="text-lg font-semibold text-surface-800 mb-3">
                  About
                </h2>
                <p className="text-surface-600 leading-relaxed">{tutor.bio}</p>
              </div>
            )}

            {/* Subjects */}
            <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={18} className="text-primary-600" />
                <h2 className="text-lg font-semibold text-surface-800">
                  Subjects I Teach
                </h2>
              </div>

              {tutor.subjects.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {tutor.subjects.map((subject, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-surface-400 text-sm">
                  No subjects listed yet.
                </p>
              )}
            </div>

            {/* Availability */}
            <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar size={18} className="text-primary-600" />
                <h2 className="text-lg font-semibold text-surface-800">
                  Availability
                </h2>
              </div>

              {Object.keys(groupedAvailability).length > 0 ? (
                <div className="space-y-2">
                  {DAY_ORDER.filter((d) => groupedAvailability[d]).map((day) => (
                    <div
                      key={day}
                      className="flex items-start gap-3 p-3 bg-surface-50 rounded-xl"
                    >
                      <div className="w-24 flex-shrink-0">
                        <span className="text-sm font-semibold text-surface-700">
                          {day}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {groupedAvailability[day].map((slot, i) => (
                          <span
                            key={i}
                            className="flex items-center gap-1.5 text-xs text-primary-700 bg-primary-100 px-2.5 py-1 rounded-full font-medium"
                          >
                            <Clock size={11} />
                            {slot.startTime} – {slot.endTime}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 bg-surface-50 rounded-xl text-center">
                  <Clock size={24} className="text-surface-300 mx-auto mb-2" />
                  <p className="text-surface-400 text-sm">
                    No availability set. Contact the tutor directly.
                  </p>
                </div>
              )}
            </div>

            {/* Reviews Placeholder - will be filled in Phase 6 */}
            <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Star size={18} className="text-primary-600" />
                  <h2 className="text-lg font-semibold text-surface-800">
                    Reviews
                  </h2>
                </div>
                {tutor.totalReviews > 0 && (
                  <span className="text-sm text-surface-500">
                    {tutor.totalReviews} review
                    {tutor.totalReviews !== 1 ? "s" : ""}
                  </span>
                )}
              </div>

              {tutor.totalReviews === 0 ? (
                <div className="text-center py-8">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star size={24} className="text-amber-400" />
                  </div>
                  <p className="text-surface-500 font-medium">No reviews yet</p>
                  <p className="text-surface-400 text-sm mt-1">
                    Be the first to book a session and leave a review!
                  </p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="flex justify-center mb-2">
                    <StarDisplay rating={tutor.averageRating} size={24} />
                  </div>
                  <p className="text-3xl font-bold text-surface-900">
                    {tutor.averageRating.toFixed(1)}
                  </p>
                  <p className="text-surface-400 text-sm">
                    Based on {tutor.totalReviews} review
                    {tutor.totalReviews !== 1 ? "s" : ""}
                  </p>
                  <p className="text-surface-400 text-sm mt-3 italic">
                    Detailed reviews will appear here in the next update.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TutorPublicProfile;