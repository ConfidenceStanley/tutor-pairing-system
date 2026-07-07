const express = require("express");
const router = express.Router();
const {
  getStats,
  getUsers,
  getUser,
  deactivateUser,
  activateUser,
  deleteUser,
  getSessions,
  getPayments,
} = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/roleMiddleware");

router.get("/stats", protect, isAdmin, getStats);
router.get("/users", protect, isAdmin, getUsers);
router.get("/users/:id", protect, isAdmin, getUser);
router.put("/users/:id/deactivate", protect, isAdmin, deactivateUser);
router.put("/users/:id/activate", protect, isAdmin, activateUser);
router.delete("/users/:id", protect, isAdmin, deleteUser);
router.get("/sessions", protect, isAdmin, getSessions);
router.get("/payments", protect, isAdmin, getPayments);

module.exports = router;