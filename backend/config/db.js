// config/db.js
const mongoose = require("mongoose");
// No need to require('dotenv').config() here if it's done first in server.js
// require('dotenv').config(); // Optional: If you want this file runnable independently

const connectDB = async () => {
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    console.error("FATAL ERROR: MONGODB_URI is not defined in .env file.");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully.");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB; // Export the function
