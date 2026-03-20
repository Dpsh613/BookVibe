// This is the core of the BookVibe experience. It remembers the books they opened, the mood they were in when they opened it, and their exact page.

import mongoose from "mongoose";

const librarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  bookId: {
    type: Number,
    required: true, // gutendex id
  },
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
  },
  coverImage: {
    type: String,
  },
  readLink: {
    type: String,
    required: true, //epub link
  },
  // saving the exact paragraph/page they are on
  lastLocation: {
    type: String,
    default: null,
  },
  // tracking emotions
  moodWhenStarted: {
    type: String,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
  lasReadAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Library", librarySchema);
