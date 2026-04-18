import express from "express";
import {
  discoverBooks,
  proxyEpub,
  searchBooks,
} from "../controllers/bookController.js";
const router = express.Router();

// route for discovering books
router.get("/discover", discoverBooks);
router.get("/proxy", proxyEpub);
router.get("/search", searchBooks);

export default router;
