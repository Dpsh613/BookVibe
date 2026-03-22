import Library from "../models/Library.js"; // Match your exact file name

// @desc    Save or update reading progress
// @route   POST /api/library/save
// @access  Private
const saveProgress = async (req, res) => {
  const {
    bookId,
    title,
    author,
    coverImage,
    readLink,
    lastLocation,
    moodWhenStarted,
  } = req.body;
  const userId = req.user._id; // Provided by authMiddleware

  try {
    // 1. Check if the book is already in the user's library
    let libraryItem = await Library.findOne({ userId, bookId });

    if (libraryItem) {
      // 2. If it exists, UPDATE the location and last read time
      libraryItem.lastLocation = lastLocation;
      libraryItem.lastReadAt = Date.now(); // Assuming you fixed the typo in schema
      await libraryItem.save();

      return res
        .status(200)
        .json({ message: "Progress updated quietly.", libraryItem });
    }

    // 3. If it doesn't exist, CREATE a new entry in their library
    libraryItem = await Library.create({
      userId,
      bookId,
      title,
      author,
      coverImage,
      readLink,
      lastLocation,
      moodWhenStarted,
    });

    res.status(201).json({ message: "Book added to your space.", libraryItem });
  } catch (error) {
    console.error("Save progress error:", error.message);
    res.status(500).json({ message: "Failed to save reading state." });
  }
};

// @desc    Get user's library (for their personal dashboard)
// @route   GET /api/library
// @access  Private
const getMyLibrary = async (req, res) => {
  try {
    // Find all books for this user, sorted by recently read
    const myBooks = await Library.find({ userId: req.user._id }).sort({
      lastReadAt: -1,
    });
    res.status(200).json(myBooks);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve your space." });
  }
};

export { saveProgress, getMyLibrary };
