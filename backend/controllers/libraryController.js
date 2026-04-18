import Library from "../models/Library.js";

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
  const userId = req.user._id;

  try {
    // 1. Force bookId to be a Number so Mongoose never gets confused
    const numericBookId = Number(bookId);

    // 2. Search for the existing book using exact types
    let libraryItem = await Library.findOne({ userId, bookId: numericBookId });

    if (libraryItem) {
      // 3. UPDATE: Only overwrite location if a new valid location is provided
      if (lastLocation) {
        libraryItem.lastLocation = lastLocation;
      }
      libraryItem.lastReadAt = Date.now();
      await libraryItem.save();

      return res
        .status(200)
        .json({ message: "Progress updated quietly.", libraryItem });
    }

    // 4. CREATE new entry if it doesn't exist
    libraryItem = await Library.create({
      userId,
      bookId: numericBookId,
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
