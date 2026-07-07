import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  X,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { searchTutors } from "../api/tutorApi";
import TutorCard from "../components/TutorCard";
import Navbar from "../components/Navbar";
import { DEPARTMENTS, LEVELS } from "../utils/constants";

// Skeleton card for loading state
// Skeleton card for loading state
const TutorCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-5 flex flex-col gap-4 animate-pulse h-full">
    <div className="flex items-start gap-3">
      <div className="w-14 h-14 rounded-full bg-surface-200 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-surface-200 rounded w-3/4" />
        <div className="h-3 bg-surface-200 rounded w-1/2" />
        <div className="h-3 bg-surface-200 rounded w-1/3" />
      </div>
    </div>
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="w-3.5 h-3.5 bg-surface-200 rounded-full" />
      ))}
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-surface-200 rounded" />
      <div className="h-3 bg-surface-200 rounded w-4/5" />
    </div>
    <div className="flex gap-1.5 flex-wrap">
      <div className="h-5 w-16 bg-surface-200 rounded-full" />
      <div className="h-5 w-20 bg-surface-200 rounded-full" />
      <div className="h-5 w-14 bg-surface-200 rounded-full" />
    </div>
    <div className="mt-auto pt-3 border-t border-surface-100">
      <div className="h-6 w-24 bg-surface-200 rounded mb-3" />
      <div className="grid grid-cols-2 gap-2">
        <div className="h-9 bg-surface-200 rounded-xl" />
        <div className="h-9 bg-surface-200 rounded-xl" />
      </div>
    </div>
  </div>
);

// Available days options
const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const RATING_OPTIONS = [
  { label: "Any Rating", value: "" },
  { label: "4+ Stars", value: "4" },
  { label: "3+ Stars", value: "3" },
  { label: "2+ Stars", value: "2" },
];

const SearchTutors = () => {
  // Search input (raw value, debounced separately)
  const [searchInput, setSearchInput] = useState("");

  // Filters
  const [filters, setFilters] = useState({
    subject: "",
    department: "",
    level: "",
    minRating: "",
    day: "",
  });

  // Results
  const [tutors, setTutors] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Mobile filter sidebar
  const [showFilters, setShowFilters] = useState(false);

  // Debounce ref
  const debounceRef = useRef(null);

  // Fetch tutors
  const fetchTutors = useCallback(async (params) => {
    setLoading(true);
    setError("");
    try {
      const result = await searchTutors(params);
      setTutors(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tutors");
      setTutors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Trigger fetch when filters or page changes
  useEffect(() => {
    fetchTutors({
      ...filters,
      page: pagination.page,
      limit: pagination.limit,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, pagination.page]);

  // Debounce subject search input
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchInput(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      // Reset to page 1 on new search
      setPagination((prev) => ({ ...prev, page: 1 }));
      setFilters((prev) => ({ ...prev, subject: value }));
    }, 300);
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setPagination((prev) => ({ ...prev, page: 1 }));
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchInput("");
    setFilters({
      subject: "",
      department: "",
      level: "",
      minRating: "",
      day: "",
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  // Check if any filter is active
  const hasActiveFilters =
    searchInput ||
    filters.department ||
    filters.level ||
    filters.minRating ||
    filters.day;

  // Pagination handlers
  const goToPage = (page) => {
    setPagination((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Filter sidebar content (shared between desktop + mobile)
  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-surface-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Department */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-2">
          Department
        </label>
        <select
          value={filters.department}
          onChange={(e) => handleFilterChange("department", e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-surface-200 text-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        >
          <option value="">All Departments</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Level */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-2">
          Level
        </label>
        <div className="grid grid-cols-2 gap-2">
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              onClick={() =>
                handleFilterChange("level", filters.level === lvl ? "" : lvl)
              }
              className={`py-2 px-3 rounded-xl text-sm font-medium border transition-colors ${
                filters.level === lvl
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-surface-700 border-surface-200 hover:border-primary-300"
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-2">
          Minimum Rating
        </label>
        <div className="space-y-2">
          {RATING_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="minRating"
                value={opt.value}
                checked={filters.minRating === opt.value}
                onChange={() => handleFilterChange("minRating", opt.value)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-surface-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Available Day */}
      <div>
        <label className="block text-sm font-medium text-surface-700 mb-2">
          Available On
        </label>
        <select
          value={filters.day}
          onChange={(e) => handleFilterChange("day", e.target.value)}
          className="w-full px-3 py-2 rounded-xl border border-surface-200 text-surface-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
        >
          <option value="">Any Day</option>
          {DAYS.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <>
      <Navbar />
        <div className="min-h-screen bg-surface-50">
          {/* Page Header */}
          <div className="bg-white border-b border-surface-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <h1 className="text-3xl font-bold text-surface-900 mb-2">
                Find a Tutor
              </h1>
              <p className="text-surface-500">
                Browse and connect with qualified tutors at your institution
              </p>

              {/* Search Bar */}
              <div className="mt-6 flex gap-3">
                <div className="relative flex-1 max-w-xl">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400"
                  />
                  <input
                    type="text"
                    value={searchInput}
                    onChange={handleSearchInput}
                    placeholder="Search by subject (e.g. Mathematics, Physics...)"
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-surface-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-surface-900 placeholder-surface-400 bg-white"
                  />
                  {searchInput && (
                    <button
                      onClick={() => {
                        setSearchInput("");
                        handleFilterChange("subject", "");
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Mobile filter toggle */}
                <button
                  onClick={() => setShowFilters(true)}
                  className="lg:hidden flex items-center gap-2 px-4 py-3 rounded-xl border border-surface-200 bg-white text-surface-700 hover:border-primary-300 transition-colors"
                >
                  <SlidersHorizontal size={18} />
                  <span className="text-sm font-medium">Filters</span>
                  {hasActiveFilters && (
                    <span className="w-2 h-2 rounded-full bg-primary-600" />
                  )}
                </button>
              </div>

              {/* Active filter tags */}
              {hasActiveFilters && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {filters.subject && (
                    <FilterTag
                      label={`Subject: ${filters.subject}`}
                      onRemove={() => {
                        setSearchInput("");
                        handleFilterChange("subject", "");
                      }}
                    />
                  )}
                  {filters.department && (
                    <FilterTag
                      label={`Dept: ${filters.department}`}
                      onRemove={() => handleFilterChange("department", "")}
                    />
                  )}
                  {filters.level && (
                    <FilterTag
                      label={`Level: ${filters.level}`}
                      onRemove={() => handleFilterChange("level", "")}
                    />
                  )}
                  {filters.minRating && (
                    <FilterTag
                      label={`${filters.minRating}+ Stars`}
                      onRemove={() => handleFilterChange("minRating", "")}
                    />
                  )}
                  {filters.day && (
                    <FilterTag
                      label={`Available: ${filters.day}`}
                      onRemove={() => handleFilterChange("day", "")}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex gap-8">
              {/* Desktop Filter Sidebar */}
              <aside className="hidden lg:block w-60 flex-shrink-0">
                <div className="bg-white rounded-2xl shadow-sm border border-surface-100 p-6 sticky top-8">
                  <FilterSidebar />
                </div>
              </aside>

              {/* Results */}
              <div className="flex-1 min-w-0">
                {/* Results count */}
                {!loading && !error && (
                  <div className="flex items-center gap-2 mb-6">
                    <Users size={18} className="text-surface-400" />
                    <p className="text-surface-600 text-sm">
                      {pagination.total === 0 ? (
                        "No tutors found"
                      ) : (
                        <>
                          Showing{" "}
                          <span className="font-semibold text-surface-900">
                            {(pagination.page - 1) * pagination.limit + 1}–
                            {Math.min(
                              pagination.page * pagination.limit,
                              pagination.total
                            )}
                          </span>{" "}
                          of{" "}
                          <span className="font-semibold text-surface-900">
                            {pagination.total}
                          </span>{" "}
                          tutors
                        </>
                      )}
                    </p>
                  </div>
                )}

                {/* Error State */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                    <p className="text-red-600 font-medium">{error}</p>
                    <button
                      onClick={() =>
                        fetchTutors({ ...filters, page: pagination.page })
                      }
                      className="mt-3 text-sm text-red-600 underline hover:no-underline"
                    >
                      Try again
                    </button>
                  </div>
                )}

                {/* Loading Skeletons */}
                {loading && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <TutorCardSkeleton key={i} />
                    ))}
                  </div>
                )}

                {/* Empty State */}
                {!loading && !error && tutors.length === 0 && (
                  <div className="text-center py-20">
                    <div className="w-20 h-20 rounded-full bg-surface-100 flex items-center justify-center mx-auto mb-4">
                      <Search size={36} className="text-surface-300" />
                    </div>
                    <h3 className="text-xl font-semibold text-surface-900 mb-2">
                      No tutors found
                    </h3>
                    <p className="text-surface-500 mb-6 max-w-sm mx-auto">
                      Try adjusting your search or removing some filters to see more
                      results.
                    </p>
                    {hasActiveFilters && (
                      <button
                        onClick={clearFilters}
                        className="px-6 py-2.5 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                )}

                {/* Tutor Grid */}
                {!loading && !error && tutors.length > 0 && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {tutors.map((tutor) => (
                        <TutorCard key={tutor._id} tutor={tutor} />
                      ))}
                    </div>

                    {/* Pagination */}
                    {pagination.pages > 1 && (
                      <div className="mt-10 flex items-center justify-center gap-2">
                        <button
                          onClick={() => goToPage(pagination.page - 1)}
                          disabled={pagination.page === 1}
                          className="p-2 rounded-xl border border-surface-200 text-surface-700 hover:border-primary-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronLeft size={18} />
                        </button>

                        {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                          .filter((p) => {
                            // Show first, last, current, and neighbours
                            return (
                              p === 1 ||
                              p === pagination.pages ||
                              Math.abs(p - pagination.page) <= 1
                            );
                          })
                          .reduce((acc, p, idx, arr) => {
                            // Insert ellipsis where pages are skipped
                            if (idx > 0 && p - arr[idx - 1] > 1) {
                              acc.push("...");
                            }
                            acc.push(p);
                            return acc;
                          }, [])
                          .map((item, idx) =>
                            item === "..." ? (
                              <span
                                key={`ellipsis-${idx}`}
                                className="px-2 text-surface-400"
                              >
                                ...
                              </span>
                            ) : (
                              <button
                                key={item}
                                onClick={() => goToPage(item)}
                                className={`w-10 h-10 rounded-xl text-sm font-medium transition-colors ${
                                  pagination.page === item
                                    ? "bg-primary-600 text-white"
                                    : "border border-surface-200 text-surface-700 hover:border-primary-300"
                                }`}
                              >
                                {item}
                              </button>
                            )
                          )}

                        <button
                          onClick={() => goToPage(pagination.page + 1)}
                          disabled={pagination.page === pagination.pages}
                          className="p-2 rounded-xl border border-surface-200 text-surface-700 hover:border-primary-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          {showFilters && (
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/40 z-40 lg:hidden"
                onClick={() => setShowFilters(false)}
              />
              {/* Drawer */}
              <div className="fixed inset-y-0 right-0 w-80 max-w-full bg-white z-50 shadow-xl lg:hidden flex flex-col animate-slide-in-right">
                <div className="flex items-center justify-between p-6 border-b border-surface-100">
                  <h2 className="text-lg font-semibold text-surface-900">
                    Filter Tutors
                  </h2>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="p-2 rounded-xl hover:bg-surface-100 text-surface-500 transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <FilterSidebar />
                </div>
                <div className="p-6 border-t border-surface-100">
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-full py-3 bg-primary-600 text-white rounded-xl font-medium hover:bg-primary-700 transition-colors"
                  >
                    Show Results ({pagination.total})
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
    </>
  );
};

// Small filter tag component
const FilterTag = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 bg-primary-50 text-primary-700 text-xs font-medium px-3 py-1.5 rounded-full">
    {label}
    <button
      onClick={onRemove}
      className="hover:text-primary-900 transition-colors"
    >
      <X size={12} />
    </button>
  </span>
);

export default SearchTutors;