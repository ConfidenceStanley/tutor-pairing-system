const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
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
  },
  startTime: {
    type: String,
  },
  endTime: {
    type: String,
  },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["student", "tutor", "admin"],
      required: [true, "Role is required"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
    },
    level: {
      type: String,
      enum: ["ND1", "ND2", "HND1", "HND2"],
      required: [true, "Level is required"],
    },
    subjects: {
      type: [String],
      default: [],
    },
    bio: {
      type: String,
      default: "",
    },
    availability: {
      type: [availabilitySchema],
      default: [],
    },
    profileImage: {
      type: String,
      default: "",
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    sessionRate: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);