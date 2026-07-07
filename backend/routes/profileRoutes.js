const express = require("express");
const router = express.Router();
const {
  getMyProfile,
  updateMyProfile,
  uploadProfileImage,
  updateAvailability,
  updateSubjects,
  getTutorProfile,
} = require("../controllers/profileController");
const { protect } = require("../middleware/authMiddleware");
const { isTutor } = require("../middleware/roleMiddleware");
const { multerUpload } = require("../middleware/upload");

// Public
router.get("/tutor/:id", getTutorProfile);

// Protected - all users
router.get("/me", protect, getMyProfile);
router.put("/me", protect, updateMyProfile);
router.post(
  "/upload-image",
  protect,
  multerUpload.single("profileImage"),
  uploadProfileImage
);

// Protected - tutors only
router.put("/availability", protect, isTutor, updateAvailability);
router.put("/subjects", protect, isTutor, updateSubjects);

module.exports = router;