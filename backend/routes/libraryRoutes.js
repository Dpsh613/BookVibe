import express from "express";
import {
  saveProgress,
  getMyLibrary,
} from "../controllers/libraryController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Both routes are protected by the JWT middleware
router.post("/save", protect, saveProgress);
router.get("/", protect, getMyLibrary);

export default router;
