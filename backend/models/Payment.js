const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    // Links to session (may be null until session is created after payment)
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      default: null,
      index: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    tutor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Store the booking form data so we can create the session after payment succeeds
    bookingData: {
      subject: String,
      topic: String,
      message: String,
      scheduledDate: Date,
      scheduledTime: String,
      duration: Number,
      mode: String,
      location: String,
    },
    amount: {
      // In kobo (NGN * 100)
      type: Number,
      required: true,
    },
    reference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
      index: true,
    },
    paystackResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Payment", paymentSchema);