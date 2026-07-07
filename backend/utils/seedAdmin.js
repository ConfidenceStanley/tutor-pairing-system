require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Check if admin already exists using mongoose directly
    // to avoid triggering model middleware issues
    const db = mongoose.connection.db;

    const existingAdmin = await db
      .collection("users")
      .findOne({ role: "admin" });

    if (existingAdmin) {
      console.log("Admin already exists:");
      console.log(`  Email: ${existingAdmin.email}`);
      console.log(`  Name:  ${existingAdmin.name}`);
      await mongoose.disconnect();
      process.exit(0);
    }

    // Hash password manually — bypass the pre-save hook entirely
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("Admin@123", salt);

    const now = new Date();

    await db.collection("users").insertOne({
      name: "System Admin",
      email: "admin@tutorpair.com",
      password: hashedPassword,
      role: "admin",
      department: "Computer Science",
      level: "HND2",
      subjects: [],
      bio: "",
      availability: [],
      profileImage: "",
      averageRating: 0,
      totalReviews: 0,
      sessionRate: 0,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    });

    console.log("✓ Admin user created successfully!");
    console.log("  Name:     System Admin");
    console.log("  Email:    admin@tutorpair.com");
    console.log("  Password: Admin@123");
    console.log("  Role:     admin");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error seeding admin:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

seedAdmin();