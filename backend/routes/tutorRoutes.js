const express = require("express");
const router = express.Router();
const { searchTutors, getTutorById } = require("../controllers/tutorController");

router.get("/", searchTutors);
router.get("/:id", getTutorById);

module.exports = router;