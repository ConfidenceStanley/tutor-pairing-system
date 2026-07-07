const axios = require("axios");
const crypto = require("crypto");
const Payment = require("../models/Payment");
const Session = require("../models/Session");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");

const PAYSTACK_BASE = "https://api.paystack.co";

// Helper: paystack axios headers
const paystackHeaders = () => ({
  Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
  "Content-Type": "application/json",
});

// POST /api/payments/initialize
// Body: { tutorId, subject, topic, message, scheduledDate, scheduledTime, duration, mode, location }
const initializePayment = asyncHandler(async (req, res) => {
  // Only students can pay
  if (req.user.role !== "student") {
    res.status(403);
    throw new Error("Only students can book and pay");
  }

  const {
    tutorId,
    subject,
    topic,
    message,
    scheduledDate,
    scheduledTime,
    duration,
    mode,
    location,
  } = req.body;

  // Validate required fields (same rules as session creation)
  if (!tutorId || !subject || !topic || !scheduledDate || !scheduledTime) {
    res.status(400);
    throw new Error("Missing required booking fields");
  }

  // Fetch tutor
  const tutor = await User.findById(tutorId);
  if (!tutor || tutor.role !== "tutor" || !tutor.isActive) {
    res.status(404);
    throw new Error("Tutor not available");
  }

  if (tutor._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot book yourself");
  }

  if (!tutor.sessionRate || tutor.sessionRate <= 0) {
    res.status(400);
    throw new Error("Tutor has not set a session rate yet");
  }

  const finalDuration = Number(duration) || 60;
  const validDurations = [30, 60, 90, 120];
  if (!validDurations.includes(finalDuration)) {
    res.status(400);
    throw new Error("Invalid duration");
  }

  const finalMode = mode || "physical";
  if (!["online", "physical"].includes(finalMode)) {
    res.status(400);
    throw new Error("Invalid mode");
  }

  // Validate future date
  const dateObj = new Date(scheduledDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (dateObj < today) {
    res.status(400);
    throw new Error("Scheduled date must be in the future");
  }

  // Calculate NGN amount, then convert to kobo
  const amountNaira = Math.round((tutor.sessionRate * finalDuration) / 60);
  const amountKobo = amountNaira * 100;

  if (amountKobo <= 0) {
    res.status(400);
    throw new Error("Invalid amount");
  }

  // Generate unique reference
  const reference = `TP-${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;

  // Store pending payment with booking data
  const payment = await Payment.create({
    student: req.user._id,
    tutor: tutor._id,
    amount: amountKobo,
    reference,
    status: "pending",
    bookingData: {
      subject: subject.trim(),
      topic: topic.trim(),
      message: message ? message.trim() : "",
      scheduledDate: dateObj,
      scheduledTime,
      duration: finalDuration,
      mode: finalMode,
      location: location ? location.trim() : "",
    },
  });

  // Initialize with Paystack
  try {
    const callbackUrl = `${process.env.CLIENT_URL}/payment/callback`;

    const psResponse = await axios.post(
      `${PAYSTACK_BASE}/transaction/initialize`,
      {
        email: req.user.email,
        amount: amountKobo,
        reference,
        callback_url: callbackUrl,
        metadata: {
          student_id: req.user._id.toString(),
          tutor_id: tutor._id.toString(),
          tutor_name: tutor.name,
          subject: subject.trim(),
        },
      },
      { headers: paystackHeaders() }
    );

    if (!psResponse.data.status) {
      // Clean up
      await Payment.findByIdAndDelete(payment._id);
      res.status(500);
      throw new Error("Payment initialization failed");
    }

    res.status(200).json({
      success: true,
      message: "Payment initialized",
      data: {
        authorizationUrl: psResponse.data.data.authorization_url,
        accessCode: psResponse.data.data.access_code,
        reference: psResponse.data.data.reference,
        amount: amountNaira,
      },
    });
  } catch (err) {
    // Clean up on failure
    await Payment.findByIdAndDelete(payment._id);
    console.error(
      "Paystack init error:",
      err.response?.data || err.message
    );
    res.status(500);
    throw new Error(
      err.response?.data?.message || "Failed to initialize payment"
    );
  }
});

// GET /api/payments/verify/:reference
const verifyPayment = asyncHandler(async (req, res) => {
  const { reference } = req.params;

  if (!reference) {
    res.status(400);
    throw new Error("Reference required");
  }

  // Find payment record
  const payment = await Payment.findOne({ reference });
  if (!payment) {
    res.status(404);
    throw new Error("Payment not found");
  }

  // Must belong to the requesting user
  if (payment.student.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Access denied");
  }

  // If already processed, return current state
  if (payment.status === "success" && payment.session) {
    const session = await Session.findById(payment.session)
      .populate("tutor", "name email profileImage department")
      .populate("student", "name email profileImage");
    return res.json({
      success: true,
      message: "Payment already verified",
      data: { payment, session },
    });
  }

  // Verify with Paystack
  try {
    const psResponse = await axios.get(
      `${PAYSTACK_BASE}/transaction/verify/${reference}`,
      { headers: paystackHeaders() }
    );

    const data = psResponse.data.data;

    payment.paystackResponse = data;

    if (data.status === "success") {
      // Confirm amount matches
      if (data.amount !== payment.amount) {
        payment.status = "failed";
        await payment.save();
        res.status(400);
        throw new Error("Payment amount mismatch");
      }

      // Create the session now
      const bd = payment.bookingData;
      const session = await Session.create({
        student: payment.student,
        tutor: payment.tutor,
        subject: bd.subject,
        topic: bd.topic,
        message: bd.message,
        scheduledDate: bd.scheduledDate,
        scheduledTime: bd.scheduledTime,
        duration: bd.duration,
        mode: bd.mode,
        location: bd.location,
        amount: payment.amount / 100, // back to naira
        status: "pending",
        isPaid: true,
        paymentRef: reference,
      });

      payment.status = "success";
      payment.session = session._id;
      await payment.save();

      const populated = await Session.findById(session._id)
        .populate("tutor", "name email profileImage department")
        .populate("student", "name email profileImage");

      return res.json({
        success: true,
        message: "Payment verified successfully",
        data: { payment, session: populated },
      });
    } else {
      payment.status = "failed";
      await payment.save();
      return res.json({
        success: false,
        message: "Payment was not successful",
        data: { payment },
      });
    }
  } catch (err) {
    console.error(
      "Paystack verify error:",
      err.response?.data || err.message
    );
    res.status(500);
    throw new Error("Failed to verify payment");
  }
});

// GET /api/payments/my-payments
const getMyPayments = asyncHandler(async (req, res) => {
  const filter =
    req.user.role === "tutor"
      ? { tutor: req.user._id, status: "success" }
      : { student: req.user._id };

  const payments = await Payment.find(filter)
    .populate("tutor", "name profileImage")
    .populate("student", "name profileImage")
    .populate("session", "subject topic scheduledDate status")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: payments });
});

module.exports = {
  initializePayment,
  verifyPayment,
  getMyPayments,
};