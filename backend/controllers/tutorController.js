const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/tutors
const searchTutors = asyncHandler(async (req, res) => {
  const {
    subject,
    department,
    level,
    minRating,
    day,
    page = 1,
    limit = 12,
  } = req.query;

  // Build filter object
  const filter = {
    role: "tutor",
    isActive: true,
  };

  // Subject: case-insensitive partial match
  if (subject && subject.trim()) {
    filter.subjects = {
      $elemMatch: { $regex: subject.trim(), $options: "i" },
    };
  }

  // Department: case-insensitive partial match
  if (department && department.trim()) {
    filter.department = { $regex: department.trim(), $options: "i" };
  }

  // Level: exact match
  if (level && level.trim()) {
    const validLevels = ["ND1", "ND2", "HND1", "HND2"];
    if (validLevels.includes(level.trim())) {
      filter.level = level.trim();
    }
  }

  // Minimum rating
  if (minRating) {
    const rating = parseFloat(minRating);
    if (!isNaN(rating) && rating >= 0 && rating <= 5) {
      filter.averageRating = { $gte: rating };
    }
  }

  // Available on a specific day
  if (day && day.trim()) {
    const validDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    if (validDays.includes(day.trim())) {
      filter["availability.day"] = day.trim();
    }
  }

  // Pagination
  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
  const skip = (pageNum - 1) * limitNum;

  // Run query and count in parallel
  const [tutors, total] = await Promise.all([
    User.find(filter)
      .select("-password")
      .sort({ averageRating: -1, createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    User.countDocuments(filter),
  ]);

  const pages = Math.ceil(total / limitNum);

  res.json({
    success: true,
    data: tutors,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages,
    },
  });
});

// GET /api/tutors/:id
const getTutorById = asyncHandler(async (req, res) => {
  const tutor = await User.findById(req.params.id).select("-password");

  if (!tutor) {
    res.status(404);
    throw new Error("Tutor not found");
  }

  if (tutor.role !== "tutor") {
    res.status(404);
    throw new Error("This user is not a tutor");
  }

  if (!tutor.isActive) {
    res.status(404);
    throw new Error("Tutor profile not available");
  }

  res.json({ success: true, data: tutor });
});

module.exports = { searchTutors, getTutorById };