const express = require("express");
const router = express.Router();
const {
  initializePayment,
  verifyPayment,
  getMyPayments,
} = require("../controllers/paymentController");
const { protect } = require("../middleware/authMiddleware");

router.post("/initialize", protect, initializePayment);
router.get("/verify/:reference", protect, verifyPayment);
router.get("/my-payments", protect, getMyPayments);

module.exports = router;