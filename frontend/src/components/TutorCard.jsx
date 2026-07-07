import { Link } from "react-router-dom";
import { Star, MapPin, BookOpen, GraduationCap } from "lucide-react";

const TutorCard = ({ tutor }) => {
  const {
    _id,
    name,
    profileImage,
    department,
    level,
    subjects = [],
    averageRating,
    totalReviews,
    sessionRate,
    bio,
  } = tutor;

  const visibleSubjects = subjects.slice(0, 3);
  const remainingCount = subjects.length - 3;

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={
          i < Math.round(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "text-surface-300"
        }
      />
    ));
  };

  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "TU";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-5 flex flex-col gap-4 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 h-full">
      {/* Header: Avatar + Name + Department */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {profileImage ? (
            <img
              src={profileImage}
              alt={name}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-primary-100"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center ring-2 ring-primary-100">
              <span className="text-white font-bold text-base">{initials}</span>
            </div>
          )}
        </div>

        {/* Name + Meta */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-surface-900 text-base leading-tight truncate">
            {name}
          </h3>
          <div className="flex items-center gap-1 mt-1 text-surface-500 text-xs">
            <MapPin size={11} className="flex-shrink-0" />
            <span className="truncate">{department}</span>
          </div>
          <div className="flex items-center gap-1 mt-0.5 text-surface-500 text-xs">
            <GraduationCap size={11} className="flex-shrink-0" />
            <span>{level}</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-0.5">{renderStars(averageRating)}</div>
        <span className="text-sm font-semibold text-surface-700">
          {averageRating > 0 ? averageRating.toFixed(1) : "New"}
        </span>
        {totalReviews > 0 && (
          <span className="text-xs text-surface-400">
            ({totalReviews})
          </span>
        )}
      </div>

      {/* Bio */}
      {bio && (
        <p className="text-sm text-surface-600 line-clamp-2 leading-relaxed">
          {bio}
        </p>
      )}

      {/* Subjects */}
      {subjects.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {visibleSubjects.map((subject, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 bg-primary-50 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full"
            >
              <BookOpen size={10} />
              {subject}
            </span>
          ))}
          {remainingCount > 0 && (
            <span className="inline-flex items-center bg-surface-100 text-surface-600 text-xs font-medium px-2 py-0.5 rounded-full">
              +{remainingCount}
            </span>
          )}
        </div>
      )}

      {/* Price section - own row */}
      <div className="mt-auto pt-3 border-t border-surface-100">
        <div className="mb-3">
          {sessionRate > 0 ? (
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-surface-900">
                ₦{sessionRate.toLocaleString()}
              </span>
              <span className="text-xs text-surface-400">/session</span>
            </div>
          ) : (
            <span className="text-sm text-surface-400 italic">Rate not set</span>
          )}
        </div>

        {/* Buttons - full width row */}
        <div className="grid grid-cols-2 gap-2">
          <Link
            to={`/tutor/profile/${_id}`}
            className="px-3 py-2 text-sm font-medium text-primary-600 border border-primary-200 rounded-xl hover:bg-primary-50 transition-colors text-center whitespace-nowrap"
          >
            View Profile
          </Link>
          <Link
            to={`/book-session/${_id}`}
            className="px-3 py-2 text-sm font-medium bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-center whitespace-nowrap"
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TutorCard;