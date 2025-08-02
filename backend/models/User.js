// models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Use bcryptjs

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true, // Ensure usernames are unique
      lowercase: true, // Store usernames in lowercase for case-insensitive login
      trim: true, // Remove leading/trailing whitespace
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"], // Enforce minimum length
    },
  },
  { timestamps: true }
);

// --- Password Hashing Middleware ---
// This function runs *before* a user document is saved ('save' hook)
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generate a salt and hash the password
    // 10-12 rounds is generally considered secure enough
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error); // Pass errors to Express error handler
  }
});

// --- Password Comparison Method ---
// Add a method to the user schema to compare passwords during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error; // Rethrow error to be caught by calling function
  }
};

module.exports = mongoose.model("User", userSchema); // Collection will be 'users'
