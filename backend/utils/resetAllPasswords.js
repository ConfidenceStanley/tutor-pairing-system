require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// List every existing account email and their original password here
const ACCOUNTS = [
  { email: "confidenceohireimen@gmail.com", password: "Password123" },
  { email: "confidencestanley75@gmail.com", password: "Password123" },
  { email: "admin@tutorpair.com", password: "Admin@123" },
  { email: "confidenceomon75@gmail.com", password: "Password123" },
  { email: "chinedu@africajobs.com", password: "Password123" },
  // add every other account that existed before this fix
];

const resetAll = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const db = mongoose.connection.db;

    for (const account of ACCOUNTS) {
      const user = await db
        .collection("users")
        .findOne({ email: account.email });

      if (!user) {
        console.log(`  NOT FOUND: ${account.email}`);
        continue;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(account.password, salt);

      await db.collection("users").updateOne(
        { email: account.email },
        { $set: { password: hashedPassword, updatedAt: new Date() } }
      );

      console.log(`  ✓ Reset: ${account.email}`);
    }

    console.log("\nAll passwords reset successfully!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

resetAll();