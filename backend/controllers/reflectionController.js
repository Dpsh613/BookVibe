import Reflection from "../models/Reflection.js";

export const saveReflection = async (req, res) => {
  try {
    const { mood, prompt, answer, associatedBook } = req.body;

    // Fixed: req.user_.id -> req.user._id (or req.user.id)
    const userId = req.user._id || req.user.id;

    const newReflection = await Reflection.create({
      userId,
      mood,
      prompt,
      answer,
      associatedBook,
    });

    res.status(201).json(newReflection);
  } catch (error) {
    // ADDED: console.error so you can see exactly why it fails in the backend terminal
    console.error("Error in saveReflection:", error);
    res.status(500).json({ message: "Failed to save reflection" });
  }
};

export const getMyReflections = async (req, res) => {
  try {
    // Fixed: req.user_.id -> req.user._id (or req.user.id)
    const userId = req.user._id || req.user.id;

    const reflections = await Reflection.find({ userId }).sort({
      createdAt: -1,
    });

    // FIXED: You forgot to actually send the data back to the frontend!
    res.status(200).json(reflections);
  } catch (error) {
    // ADDED: console.error
    console.error("Error in getMyReflections:", error);
    res.status(500).json({ message: "Failed to fetch reflections" });
  }
};
