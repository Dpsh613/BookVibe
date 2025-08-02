// models/Book.js
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    id: {
      // Gutendex ID
      type: Number,
      required: true,
      // Note: Unique constraint should now be combined with userId
      // unique: true, // Remove this simple unique constraint
    },
    title: {
      type: String,
      required: true,
    },
    authors: {
      type: String,
      required: false,
    },
    // --- Add userId ---
    userId: {
      type: mongoose.Schema.Types.ObjectId, // Reference to the User model's _id
      ref: "User", // Link to the 'User' model
      required: true, // Every book must belong to a user
      index: true, // Index userId for faster lookups of a user's list
    },
  },
  {
    timestamps: true,
    // --- Add Compound Index ---
    // Ensures a specific user cannot add the same book (by Gutendex id) twice
    indexes: [{ fields: { userId: 1, id: 1 }, unique: true }],
  }
);

module.exports = mongoose.model("Book", bookSchema);
