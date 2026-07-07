const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { uploadToCloudinary } = require("../middleware/upload");

// @desc    Get logged in user profile
// @route   GET /api/profile/me
// @access  Protected
const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Update logged in user profile
// @route   PUT /api/profile/me
// @access  Protected
const updateMyProfile = asyncHandler(async (req, res) => {
  const { name, department, level, bio, sessionRate } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (name !== undefined) user.name = name.trim();
  if (department !== undefined) user.department = department.trim();
  if (level !== undefined) {
    const validLevels = ["ND1", "ND2", "HND1", "HND2"];
    if (!validLevels.includes(level)) {
      res.status(400);
      throw new Error("Invalid level. Must be ND1, ND2, HND1, or HND2");
    }
    user.level = level;
  }

  if (user.role === "tutor") {
    if (bio !== undefined) user.bio = bio.trim();
    if (sessionRate !== undefined) {
      const rate = Number(sessionRate);
      if (isNaN(rate) || rate < 0) {
        res.status(400);
        throw new Error("Session rate must be a positive number");
      }
      user.sessionRate = rate;
    }
  }

  const updatedUser = await user.save();
  const userResponse = await User.findById(updatedUser._id).select("-password");

  res.json({
    success: true,
    message: "Profile updated successfully",
    data: userResponse,
  });
});

// @desc    Upload profile image to Cloudinary
// @route   POST /api/profile/upload-image
// @access  Protected
const uploadProfileImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error("No image file provided");
  }

  console.log("File received:", {
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    hasBuffer: !!req.file.buffer,
  });

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const result = await uploadToCloudinary(
    req.file.buffer,
    req.file.mimetype,
    "tutor-pairing/profile-images"
  );

  user.profileImage = result.secure_url;
  await user.save();

  res.json({
    success: true,
    message: "Profile image uploaded successfully",
    data: {
      profileImage: result.secure_url,
    },
  });
});

// @desc    Update tutor availability
// @route   PUT /api/profile/availability
// @access  Protected, Tutors only
const updateAvailability = asyncHandler(async (req, res) => {
  const { availability } = req.body;

  if (!Array.isArray(availability)) {
    res.status(400);
    throw new Error("Availability must be an array");
  }

  const validDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  for (const slot of availability) {
    if (!slot.day || !slot.startTime || !slot.endTime) {
      res.status(400);
      throw new Error(
        "Each availability slot must have day, startTime, and endTime"
      );
    }
    if (!validDays.includes(slot.day)) {
      res.status(400);
      throw new Error(`Invalid day: ${slot.day}`);
    }
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(slot.startTime) || !timeRegex.test(slot.endTime)) {
      res.status(400);
      throw new Error("Times must be in HH:MM format");
    }
    if (slot.startTime >= slot.endTime) {
      res.status(400);
      throw new Error(`Start time must be before end time for ${slot.day}`);
    }
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { availability },
    { new: true }
  ).select("-password");

  res.json({
    success: true,
    message: "Availability updated successfully",
    data: user,
  });
});

// @desc    Update tutor subjects
// @route   PUT /api/profile/subjects
// @access  Protected, Tutors only
const updateSubjects = asyncHandler(async (req, res) => {
  const { subjects } = req.body;

  if (!Array.isArray(subjects)) {
    res.status(400);
    throw new Error("Subjects must be an array");
  }
  if (subjects.length === 0) {
    res.status(400);
    throw new Error("Please add at least one subject");
  }
  if (subjects.length > 10) {
    res.status(400);
    throw new Error("You can add a maximum of 10 subjects");
  }

  const cleanedSubjects = subjects.map((s) => {
    if (typeof s !== "string" || s.trim().length === 0) {
      throw new Error("Each subject must be a non-empty string");
    }
    return s.trim();
  });

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { subjects: cleanedSubjects },
    { new: true }
  ).select("-password");

  res.json({
    success: true,
    message: "Subjects updated successfully",
    data: user,
  });
});

// @desc    Get public tutor profile by ID
// @route   GET /api/profile/tutor/:id
// @access  Public
const getTutorProfile = asyncHandler(async (req, res) => {
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
    throw new Error("This tutor profile is not available");
  }

  res.json({
    success: true,
    data: tutor,
  });
});

module.exports = {
  getMyProfile,
  updateMyProfile,
  uploadProfileImage,
  updateAvailability,
  updateSubjects,
  getTutorProfile,
};