import express from "express";
import { saveProgress, getMyLibrary } from "../controllers/libraryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Both routes are protected by the JWT middleware
router.post("/save", protect, saveProgress);
router.get("/", protect, getMyLibrary);

export default router;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5YmUyZTI5NDA3YjdjODA4ZWI1NzNjYiIsImlhdCI6MTc3NDA3MTMzNywiZXhwIjoxNzc2NjYzMzM3fQ.h4PzoiLGH8r4URUEn8xzqggyc7YIUUHZgICm-KLIOVk
