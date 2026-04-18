import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import bookRoutes from "./routes/bookRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import libraryRoutes from "./routes/libraryRoutes.js";
import reflectionRoutes from "./routes/reflectionRoutes.js";

dotenv.config();

const app = express();

// middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173", // Vite's default local port
    credentials: true,
  }),
);

app.use(express.json());

// connecting to mongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.error("mongoDB connection error:", err));

// routes
app.use("/api/books", bookRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/reflections", reflectionRoutes);

// health check route

app.get("/", (req, res) => {
  res.send("bookVibe API is running quietly in the background.");
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`BookVibe Server is running on port ${PORT}`);
});
