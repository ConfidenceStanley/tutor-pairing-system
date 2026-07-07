const User = require("../models/User");
const Session = require("../models/Session");
const Payment = require("../models/Payment");
const Review = require("../models/Review");
const asyncHandler = require("../utils/asyncHandler");

// GET /api/admin/stats
const getStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalStudents,
    totalTutors,
    totalSessions,
    activeSessions,
    pendingSessions,
    completedSessions,
    totalReviews,
    revenueResult,
    recentSessions,
  ] = await Promise.all([
    User.countDocuments({ role: { $ne: "admin" } }),
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "tutor" }),
    Session.countDocuments(),
    Session.countDocuments({ status: "accepted" }),
    Session.countDocuments({ status: "pending" }),
    Session.countDocuments({ status: "completed" }),
    Review.countDocuments(),
    Payment.aggregate([
      { $match: { status: "success" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Session.find()
      .populate("student", "name email profileImage")
      .populate("tutor", "name email profileImage")
      .sort({ createdAt: -1 })
      .limit(10),
  ]);

  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total / 100 : 0;

  res.json({
    success: true,
    data: {
      totalUsers,
      totalStudents,
      totalTutors,
      totalSessions,
      activeSessions,
      pendingSessions,
      completedSessions,
      totalReviews,
      totalRevenue,
      recentSessions,
    },
    message: "Admin stats retrieved",
  });
});

// GET /api/admin/users
const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = "", role = "" } = req.query;

  const query = { role: { $ne: "admin" } };

  if (role && ["student", "tutor"].includes(role)) {
    query.role = role;
  }

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { department: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    User.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    },
    message: "Users retrieved",
  });
});

// GET /api/admin/users/:id
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const [sessionCount, reviewCount, paymentResult] = await Promise.all([
    Session.countDocuments({
      $or: [{ student: user._id }, { tutor: user._id }],
    }),
    Review.countDocuments({
      $or: [{ student: user._id }, { tutor: user._id }],
    }),
    Payment.aggregate([
      {
        $match: {
          $or: [{ student: user._id }, { tutor: user._id }],
          status: "success",
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
  ]);

  const totalPayments = paymentResult.length > 0 ? paymentResult[0].total / 100 : 0;

  res.json({
    success: true,
    data: {
      user,
      stats: {
        sessionCount,
        reviewCount,
        totalPayments,
      },
    },
    message: "User details retrieved",
  });
});

// PUT /api/admin/users/:id/deactivate
const deactivateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.role === "admin") {
    res.status(400);
    throw new Error("Cannot deactivate admin users");
  }

  user.isActive = false;
  await user.save();

  res.json({
    success: true,
    data: user,
    message: `${user.name} has been deactivated`,
  });
});

// PUT /api/admin/users/:id/activate
const activateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.isActive = true;
  await user.save();

  res.json({
    success: true,
    data: user,
    message: `${user.name} has been activated`,
  });
});

// DELETE /api/admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.role === "admin") {
    res.status(400);
    throw new Error("Cannot delete admin users");
  }

  await User.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    data: null,
    message: `${user.name} has been deleted`,
  });
});

// GET /api/admin/sessions
const getSessions = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status = "" } = req.query;

  const query = {};

  if (status && ["pending", "accepted", "declined", "completed", "cancelled"].includes(status)) {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [sessions, total] = await Promise.all([
    Session.find(query)
      .populate("student", "name email profileImage")
      .populate("tutor", "name email profileImage")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Session.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: {
      sessions,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    },
    message: "Sessions retrieved",
  });
});

// GET /api/admin/payments
const getPayments = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, status = "" } = req.query;

  const query = {};

  if (status && ["pending", "success", "failed"].includes(status)) {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [payments, total] = await Promise.all([
    Payment.find(query)
      .populate("student", "name email")
      .populate("tutor", "name email")
      .populate("session")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit)),
    Payment.countDocuments(query),
  ]);

  res.json({
    success: true,
    data: {
      payments,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    },
    message: "Payments retrieved",
  });
});

module.exports = {
  getStats,
  getUsers,
  getUser,
  deactivateUser,
  activateUser,
  deleteUser,
  getSessions,
  getPayments,
};