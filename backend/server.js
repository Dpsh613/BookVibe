// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session"); // Require express-session
const MongoStore = require("connect-mongo"); // Require connect-mongo

// Import configuration and routes
const connectDB = require("./config/db");
const searchRoutes = require("./routes/search");
const myListRoutes = require("./routes/myList");
const authRoutes = require("./routes/auth"); // Import auth routes (we'll create this next)

// --- Connect to Database ---
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;
const SESSION_SECRET = process.env.SESSION_SECRET; // Get secret from .env

if (!SESSION_SECRET) {
  console.error("FATAL ERROR: SESSION_SECRET is not defined in .env file.");
  process.exit(1);
}

// --- Middleware ---
app.use(
  cors({
    // Configure CORS if needed for credentials later
    origin: "http://localhost:3000", // Or your frontend origin
    credentials: true, // Allow cookies to be sent
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// --- Session Configuration --- BEFORE API Routes ---
app.use(
  session({
    secret: SESSION_SECRET, // Used to sign the session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    store: MongoStore.create({
      // Store session in MongoDB
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions", // Optional: specify collection name for sessions
      ttl: 14 * 24 * 60 * 60, // Optional: session TTL (14 days in seconds)
    }),
    cookie: {
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production (HTTPS)
      httpOnly: true, // Prevent client-side JS from accessing cookie
      maxAge: 1000 * 60 * 60 * 24 * 7, // Cookie expiry (e.g., 7 days)
      // sameSite: 'lax' // Or 'strict'. Helps prevent CSRF. Adjust as needed.
    },
  })
);

// --- API Routes ---
app.use("/api/auth", authRoutes); // Mount authentication routes
app.use("/api/search", searchRoutes);
app.use("/api/my-list", myListRoutes); // Keep list routes

// --- Catch-all ---
// app.get("*", (req, res) => {
//   // Avoid sending index.html if it's an API-like path not handled above
//   if (!req.originalUrl.startsWith("/api")) {
//     res.sendFile(path.join(__dirname, "public", "index.html"));
//   } else {
//     res.status(404).json({ message: "API endpoint not found" });
//   }
// });

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
