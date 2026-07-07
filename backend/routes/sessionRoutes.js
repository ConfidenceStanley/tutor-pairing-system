const express = require("express");
const router = express.Router();
const {
  createSession,
  getMySessions,
  getSessionById,
  acceptSession,
  declineSession,
  completeSession,
  cancelSession,
} = require("../controllers/sessionController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createSession);
router.get("/my-sessions", protect, getMySessions);
router.get("/:id", protect, getSessionById);
router.put("/:id/accept", protect, acceptSession);
router.put("/:id/decline", protect, declineSession);
router.put("/:id/complete", protect, completeSession);
router.put("/:id/cancel", protect, cancelSession);

module.exports = router;