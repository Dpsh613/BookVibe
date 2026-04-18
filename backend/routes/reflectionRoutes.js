import express from "express";
import {
  getMyReflections,
  saveReflection,
} from "../controllers/reflectionController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/save", protect, saveReflection);
router.get("/", protect, getMyReflections);

export default router;
