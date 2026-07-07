const express = require("express");
const router = express.Router();
const {
  createReview,
  getTutorReviews,
  getSessionReview,
} = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

// Public
router.get("/tutor/:id", getTutorReviews);

// Protected
router.post("/", protect, createReview);
router.get("/session/:sessionId", protect, getSessionReview);

module.exports = router;