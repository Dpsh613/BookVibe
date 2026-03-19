import express from "express";
import { discoverBooks } from "../controllers/bookController.js";
const router = express.Router();

// route for discovering books
router.get("/discover", discoverBooks);

export default router;
