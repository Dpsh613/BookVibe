// // routes/myList.js
// const express = require("express");
// const router = express.Router();
// const Book = require("../models/Book");

// // --- Middleware to check authentication --- (Simple version)
// const isAuthenticated = (req, res, next) => {
//   if (req.session && req.session.userId) {
//     return next(); // User is logged in, proceed
//   } else {
//     return res.status(401).json({ message: "Unauthorized. Please log in." }); // Not logged in
//   }
// };

// // --- Apply authentication middleware to all routes in this file ---
// router.use(isAuthenticated);

// // --- Routes are now protected and use userId ---

// // GET / - Fetch logged-in user's want list
// router.get("/", async (req, res) => {
//   try {
//     // Find books ONLY for the logged-in user
//     const myList = await Book.find({ userId: req.session.userId }).sort({
//       createdAt: -1,
//     });
//     res.json(myList);
//   } catch (error) {
//     console.error("(Route) Error fetching user's want list:", error);
//     res.status(500).json({ message: "Failed to retrieve want list." });
//   }
// });

// // POST / - Add a book to logged-in user's want list
// router.post("/", async (req, res) => {
//   try {
//     const { id, title, authors } = req.body;
//     if (!id || !title) {
//       return res.status(400).json({ message: "Missing required book data." });
//     }

//     // Create new book, associating it with the logged-in user
//     const newBook = new Book({
//       id,
//       title,
//       authors: authors || "N/A",
//       userId: req.session.userId, // Add the user ID from session
//     });

//     const savedBook = await newBook.save();
//     console.log(
//       `(Route) Book added to list for user ${req.session.username}: ${savedBook.title}`
//     );
//     res.status(201).json(savedBook);
//   } catch (error) {
//     // Handle compound unique index error (user already added this book)
//     if (error.code === 11000) {
//       console.warn(
//         `(Route) User ${req.session.username} attempted to add duplicate book ID: ${req.body.id}`
//       );
//       return res
//         .status(409)
//         .json({
//           message: `Book with ID ${req.body.id} is already in your list.`,
//         });
//     }
//     console.error("(Route) Error adding book to user's list:", error);
//     res.status(500).json({ message: "Failed to add book." });
//   }
// });

// // DELETE /:bookId - Remove a book from logged-in user's list
// router.delete("/:bookId", async (req, res) => {
//   try {
//     const bookId = req.params.bookId;
//     if (!bookId || isNaN(parseInt(bookId))) {
//       return res.status(400).json({ message: "Invalid book ID." });
//     }

//     // Find and delete the book ONLY if it belongs to the logged-in user
//     const result = await Book.findOneAndDelete({
//       id: parseInt(bookId, 10),
//       userId: req.session.userId, // Ensure user owns the book
//     });

//     if (!result) {
//       // Either book ID doesn't exist or doesn't belong to this user
//       return res
//         .status(404)
//         .json({ message: `Book not found in your list or permission denied.` });
//     }

//     console.log(
//       `(Route) Book removed from list for user ${req.session.username}, ID: ${bookId}`
//     );
//     res.status(200).json({ message: `Book removed successfully.` });
//   } catch (error) {
//     console.error("(Route) Error removing book from user's list:", error);
//     res.status(500).json({ message: "Failed to remove book." });
//   }
// });

// module.exports = router;
