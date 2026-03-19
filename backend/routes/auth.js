// // routes/auth.js
// const express = require("express");
// const router = express.Router();
// const User = require("../models/User"); // Import User model

// // --- POST /api/auth/signup ---
// router.post("/signup", async (req, res) => {
//   const { username, password } = req.body;

//   // Basic validation
//   if (!username || !password) {
//     return res
//       .status(400)
//       .json({ message: "Username and password are required." });
//   }
//   if (password.length < 6) {
//     return res
//       .status(400)
//       .json({ message: "Password must be at least 6 characters long." });
//   }

//   try {
//     // Check if user already exists (case-insensitive)
//     const existingUser = await User.findOne({
//       username: username.toLowerCase(),
//     });
//     if (existingUser) {
//       return res.status(409).json({ message: "Username already exists." }); // 409 Conflict
//     }

//     // Create and save the new user (password hashing happens via middleware)
//     const newUser = new User({ username, password });
//     const savedUser = await newUser.save();

//     // --- IMPORTANT: Log the user in immediately after signup ---
//     req.session.userId = savedUser._id; // Store user's MongoDB ID in session
//     req.session.username = savedUser.username; // Store username for convenience

//     console.log(`User signed up and logged in: ${savedUser.username}`);
//     // Don't send password back, even hashed!
//     res.status(201).json({
//       message: "Signup successful!",
//       user: { id: savedUser._id, username: savedUser.username },
//     });
//   } catch (error) {
//     console.error("Signup error:", error);
//     // Handle potential validation errors from Mongoose schema
//     if (error.name === "ValidationError") {
//       return res.status(400).json({ message: error.message });
//     }
//     res.status(500).json({ message: "Server error during signup." });
//   }
// });

// // --- POST /api/auth/login ---
// router.post("/login", async (req, res) => {
//   const { username, password } = req.body;

//   if (!username || !password) {
//     return res
//       .status(400)
//       .json({ message: "Username and password are required." });
//   }

//   try {
//     // Find user by username (case-insensitive)
//     const user = await User.findOne({ username: username.toLowerCase() });

//     // Check if user exists AND if password matches
//     if (!user || !(await user.comparePassword(password))) {
//       // Generic message for security (don't reveal if username exists)
//       return res.status(401).json({ message: "Invalid username or password." }); // 401 Unauthorized
//     }

//     // --- Login Successful: Create session ---
//     req.session.userId = user._id;
//     req.session.username = user.username;

//     console.log(`User logged in: ${user.username}`);
//     res.status(200).json({
//       message: "Login successful!",
//       user: { id: user._id, username: user.username }, // Send back user info
//     });
//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Server error during login." });
//   }
// });

// // --- POST /api/auth/logout ---
// router.post("/logout", (req, res) => {
//   req.session.destroy((err) => {
//     if (err) {
//       console.error("Logout error:", err);
//       return res
//         .status(500)
//         .json({ message: "Could not log out, please try again." });
//     }
//     // Clear the cookie on the client side as well
//     res.clearCookie("connect.sid"); // Use the default cookie name, or your custom one
//     console.log("User logged out");
//     res.status(200).json({ message: "Logout successful!" });
//   });
// });

// // --- GET /api/auth/status --- (Check if user is logged in)
// router.get("/status", (req, res) => {
//   if (req.session && req.session.userId) {
//     // User is logged in
//     res.status(200).json({
//       isLoggedIn: true,
//       user: { id: req.session.userId, username: req.session.username },
//     });
//   } else {
//     // User is not logged in
//     res.status(200).json({ isLoggedIn: false });
//   }
// });

// module.exports = router;
