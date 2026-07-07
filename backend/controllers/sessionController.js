const Session = require("../models/Session");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const sendEmail = require("../utils/sendEmail");
const {
  sessionAcceptedEmail,
  sessionDeclinedEmail,
  sessionCancelledEmail,
  sessionCompletedEmail,
} = require("../utils/emailTemplates");

// ─── Helper: format date for emails ──────────────────────────────────────────

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

// ─── POST /api/sessions ───────────────────────────────────────────────────────

const createSession = asyncHandler(async (req, res) => {
  // Only students can create sessions
  if (req.user.role !== "student") {
    res.status(403);
    throw new Error("Only students can book sessions");
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

  // Validate required fields
  if (!tutorId || !subject || !topic || !scheduledDate || !scheduledTime) {
    res.status(400);
    throw new Error("Missing required fields");
  }

  // Validate tutor exists and is active
  const tutor = await User.findById(tutorId);
  if (!tutor || tutor.role !== "tutor" || !tutor.isActive) {
    res.status(404);
    throw new Error("Tutor not found or unavailable");
  }

  // Cannot book yourself
  if (tutor._id.toString() === req.user._id.toString()) {
    res.status(400);
    throw new Error("You cannot book a session with yourself");
  }

  // Validate scheduled date is in future
  const scheduledDateTime = new Date(scheduledDate);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  if (scheduledDateTime < now) {
    res.status(400);
    throw new Error("Scheduled date must be in the future");
  }

  // Validate time format (HH:MM)
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(scheduledTime)) {
    res.status(400);
    throw new Error("Time must be in HH:MM format");
  }

  // Validate duration
  const validDurations = [30, 60, 90, 120];
  const finalDuration = duration || 60;
  if (!validDurations.includes(finalDuration)) {
    res.status(400);
    throw new Error("Invalid duration");
  }

  // Validate mode
  const validModes = ["online", "physical"];
  const finalMode = mode || "physical";
  if (!validModes.includes(finalMode)) {
    res.status(400);
    throw new Error("Invalid mode");
  }

  const finalLocation = location ? location.trim() : "";

  // Calculate amount from tutor rate (proportional to duration)
  const amount = tutor.sessionRate
    ? Math.round((tutor.sessionRate * finalDuration) / 60)
    : 0;

  // Create session
  const session = await Session.create({
    student: req.user._id,
    tutor: tutorId,
    subject: subject.trim(),
    topic: topic.trim(),
    message: message ? message.trim() : "",
    scheduledDate: scheduledDateTime,
    scheduledTime,
    duration: finalDuration,
    mode: finalMode,
    location: finalLocation,
    amount,
    status: "pending",
  });

  // Populate for response
  const populated = await Session.findById(session._id)
    .populate("tutor", "name email profileImage department sessionRate")
    .populate("student", "name email profileImage department level");

  res.status(201).json({
    success: true,
    message: "Session request sent successfully",
    data: populated,
  });
});

// ─── GET /api/sessions/my-sessions ───────────────────────────────────────────

const getMySessions = asyncHandler(async (req, res) => {
  const { status } = req.query;

  // Build filter
  const filter = {};
  if (req.user.role === "student") {
    filter.student = req.user._id;
  } else if (req.user.role === "tutor") {
    filter.tutor = req.user._id;
  } else {
    res.status(403);
    throw new Error("Access denied");
  }

  // Optional status filter
  if (status) {
    const validStatuses = [
      "pending",
      "accepted",
      "declined",
      "completed",
      "cancelled",
    ];
    if (validStatuses.includes(status)) {
      filter.status = status;
    }
  }

  const sessions = await Session.find(filter)
    .populate(
      "tutor",
      "name email profileImage department sessionRate averageRating"
    )
    .populate("student", "name email profileImage department level")
    .sort({ createdAt: -1 });

  res.json({ success: true, data: sessions });
});

// ─── GET /api/sessions/:id ────────────────────────────────────────────────────

const getSessionById = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id)
    .populate(
      "tutor",
      "name email profileImage department sessionRate averageRating"
    )
    .populate("student", "name email profileImage department level");

  if (!session) {
    res.status(404);
    throw new Error("Session not found");
  }

  // Only the student or tutor involved can view
  const isStudent =
    session.student._id.toString() === req.user._id.toString();
  const isTutor = session.tutor._id.toString() === req.user._id.toString();

  if (!isStudent && !isTutor && req.user.role !== "admin") {
    res.status(403);
    throw new Error("You are not authorized to view this session");
  }

  res.json({ success: true, data: session });
});

// ─── PUT /api/sessions/:id/accept ────────────────────────────────────────────

const acceptSession = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) {
    res.status(404);
    throw new Error("Session not found");
  }

  if (session.tutor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only the assigned tutor can accept");
  }

  if (session.status !== "pending") {
    res.status(400);
    throw new Error(`Cannot accept a ${session.status} session`);
  }

  session.status = "accepted";
  await session.save();

  const populated = await Session.findById(session._id)
    .populate("tutor", "name email profileImage department sessionRate")
    .populate("student", "name email profileImage department level");

  // Fire-and-forget: notify student their session was accepted
  const template = sessionAcceptedEmail(
    populated.student.name,
    populated.tutor.name,
    populated.subject,
    formatDate(populated.scheduledDate),
    populated.scheduledTime
  );
  sendEmail(populated.student.email, template.subject, template.html);

  res.json({
    success: true,
    message: "Session accepted",
    data: populated,
  });
});

// ─── PUT /api/sessions/:id/decline ───────────────────────────────────────────

const declineSession = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const session = await Session.findById(req.params.id);
  if (!session) {
    res.status(404);
    throw new Error("Session not found");
  }

  if (session.tutor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only the assigned tutor can decline");
  }

  if (session.status !== "pending") {
    res.status(400);
    throw new Error(`Cannot decline a ${session.status} session`);
  }

  session.status = "declined";
  session.declineReason = reason ? reason.trim() : "";
  await session.save();

  const populated = await Session.findById(session._id)
    .populate("tutor", "name email profileImage department sessionRate")
    .populate("student", "name email profileImage department level");

  // Fire-and-forget: notify student their session was declined
  const template = sessionDeclinedEmail(
    populated.student.name,
    populated.tutor.name,
    populated.subject,
    session.declineReason
  );
  sendEmail(populated.student.email, template.subject, template.html);

  res.json({
    success: true,
    message: "Session declined",
    data: populated,
  });
});

// ─── PUT /api/sessions/:id/complete ──────────────────────────────────────────

const completeSession = asyncHandler(async (req, res) => {
  const session = await Session.findById(req.params.id);
  if (!session) {
    res.status(404);
    throw new Error("Session not found");
  }

  if (session.tutor.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only the assigned tutor can mark complete");
  }

  if (session.status !== "accepted") {
    res.status(400);
    throw new Error("Only accepted sessions can be marked complete");
  }

  session.status = "completed";
  await session.save();

  const populated = await Session.findById(session._id)
    .populate("tutor", "name email profileImage department sessionRate")
    .populate("student", "name email profileImage department level");

  // Fire-and-forget: notify student the session is complete + prompt review
  const template = sessionCompletedEmail(
    populated.student.name,
    populated.tutor.name,
    populated.subject
  );
  sendEmail(populated.student.email, template.subject, template.html);

  res.json({
    success: true,
    message: "Session marked as completed",
    data: populated,
  });
});

// ─── PUT /api/sessions/:id/cancel ────────────────────────────────────────────

const cancelSession = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const session = await Session.findById(req.params.id);
  if (!session) {
    res.status(404);
    throw new Error("Session not found");
  }

  if (session.student.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Only the student can cancel");
  }

  if (!["pending", "accepted"].includes(session.status)) {
    res.status(400);
    throw new Error(`Cannot cancel a ${session.status} session`);
  }

  session.status = "cancelled";
  session.cancelReason = reason ? reason.trim() : "";
  await session.save();

  const populated = await Session.findById(session._id)
    .populate("tutor", "name email profileImage department sessionRate")
    .populate("student", "name email profileImage department level");

  // Fire-and-forget: notify tutor the session was cancelled
  const template = sessionCancelledEmail(
    populated.tutor.name,
    populated.student.name,
    populated.subject,
    session.cancelReason
  );
  sendEmail(populated.tutor.email, template.subject, template.html);

  res.json({
    success: true,
    message: "Session cancelled",
    data: populated,
  });
});

module.exports = {
  createSession,
  getMySessions,
  getSessionById,
  acceptSession,
  declineSession,
  completeSession,
  cancelSession,
};