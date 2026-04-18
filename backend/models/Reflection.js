import mongoose from "mongoose";
import User from "./User.js";

const reflectionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  mood: {
    type: String,
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
  associatedBook: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Reflection", reflectionSchema);
