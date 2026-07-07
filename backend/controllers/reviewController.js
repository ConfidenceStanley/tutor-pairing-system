const Review = require("../models/Review");
const Session = require("../models/Session");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

// Helper: recalculate tutor's average rating and total reviews
const recalculateTutorRating = async (tutorId) => {
  const reviews = await Review.find({ tutor: tutorId });
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  await User.findByIdAndUpdate(tutorId, {
    averageRating: Math.round(averageRating * 10) / 10, // 1 decimal
    totalReviews,
  });
};

// POST /api/reviews - Student submits review for a session
const createReview = asyncHandler(async (req, res) => {
  const { sessionId, rating, comment } = req.body;

  // Validate required fields
  if (!sessionId || !rating) {
    res.status(400);
    throw new Error("Session ID and rating are required");
  }

  // Validate rating range
  const numRating = Number(rating);
  if (isNaN(numRating) || numRating < 1 || numRating > 5) {
    res.status(400);
    throw new Error("Rating must be a number between 1 and 5");
  }

  // Fetch session
  const session = await Session.findById(sessionId);
  if (!session) {
    res.status(404);
    throw new Error("Session not found");
  }

  // Must be the student who booked
  if (session.student.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("You can only review your own sessions");
  }

  // Session must be completed
  if (session.status !== "completed") {
    res.status(400);
    throw new Error("You can only review completed sessions");
  }

  // Can't review twice
  if (session.isReviewed) {
    res.status(400);
    throw new Error("This session has already been reviewed");
  }

  // Create review
  const review = await Review.create({
    session: session._id,
    student: req.user._id,
    tutor: session.tutor,
    rating: numRating,
    comment: comment ? comment.trim() : "",
  });

  // Mark session reviewed
  session.isReviewed = true;
  await session.save();

  // Recalculate tutor's rating
  await recalculateTutorRating(session.tutor);

  const populated = await Review.findById(review._id).populate(
    "student",
    "name profileImage"
  );

  res.status(201).json({
    success: true,
    message: "Review submitted successfully",
    data: populated,
  });
});

// GET /api/reviews/tutor/:id - Get all reviews for a tutor
const getTutorReviews = asyncHandler(async (req, res) => {
  const tutorId = req.params.id;

  // Verify tutor exists
  const tutor = await User.findById(tutorId);
  if (!tutor || tutor.role !== "tutor") {
    res.status(404);
    throw new Error("Tutor not found");
  }

  const reviews = await Review.find({ tutor: tutorId })
    .populate("student", "name profileImage")
    .sort({ createdAt: -1 });

  // Rating breakdown (how many 5-star, 4-star, etc)
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviews.forEach((r) => {
    breakdown[r.rating] = (breakdown[r.rating] || 0) + 1;
  });

  res.json({
    success: true,
    data: reviews,
    stats: {
      averageRating: tutor.averageRating,
      totalReviews: tutor.totalReviews,
      breakdown,
    },
  });
});

// GET /api/reviews/session/:sessionId - Get review for a specific session
const getSessionReview = asyncHandler(async (req, res) => {
  const review = await Review.findOne({
    session: req.params.sessionId,
  }).populate("student", "name profileImage");

  if (!review) {
    res.status(404);
    throw new Error("No review found for this session");
  }

  res.json({ success: true, data: review });
});

module.exports = {
  createReview,
  getTutorReviews,
  getSessionReview,
};