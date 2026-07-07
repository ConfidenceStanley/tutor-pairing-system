const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const sendEmail = require("../utils/sendEmail");
const { welcomeEmail } = require("../utils/emailTemplates");

// ─── Helpers ──────────────────────────────────────────────────────────────────

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const buildUserResponse = (user, token) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    level: user.level,
    subjects: user.subjects,
    bio: user.bio,
    availability: user.availability,
    profileImage: user.profileImage,
    averageRating: user.averageRating,
    totalReviews: user.totalReviews,
    sessionRate: user.sessionRate,
    isActive: user.isActive,
    token,
  };
};

// ─── Register ─────────────────────────────────────────────────────────────────

const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    department,
    level,
    subjects,
    bio,
    sessionRate,
  } = req.body;

  if (!name || !email || !password || !role || !department || !level) {
    res.status(400);
    throw new Error("Please fill in all required fields");
  }

  if (role === "admin") {
    res.status(403);
    throw new Error("Admin accounts cannot be created through registration");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error("An account with this email already exists");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
    department,
    level,
    subjects: role === "tutor" && subjects ? subjects : [],
    bio: role === "tutor" && bio ? bio : "",
    sessionRate: role === "tutor" && sessionRate ? sessionRate : 0,
  });

  // Fire-and-forget welcome email — never blocks or crashes registration
  const { subject, html } = welcomeEmail(user.name);
  sendEmail(user.email, subject, html);

  const token = generateToken(user._id, user.role);

  res.status(201).json({
    success: true,
    data: buildUserResponse(user, token),
  });
});

// ─── Login ────────────────────────────────────────────────────────────────────

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error("Your account has been deactivated. Contact support.");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  const token = generateToken(user._id, user.role);

  res.json({
    success: true,
    data: buildUserResponse(user, token),
  });
});

// ─── Get Me ───────────────────────────────────────────────────────────────────

const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    success: true,
    data: user,
  });
});

module.exports = { register, login, getMe };