const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const availabilitySlotSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "tutor", "admin"],
      default: "student",
    },
    department: { type: String, required: true, trim: true },
    level: {
      type: String,
      enum: ["ND1", "ND2", "HND1", "HND2"],
      required: true,
    },
    subjects: { type: [String], default: [], index: true },
    bio: { type: String, default: "" },
    availability: { type: [availabilitySlotSchema], default: [] },
    profileImage: { type: String, default: "" },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
    sessionRate: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);


userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);