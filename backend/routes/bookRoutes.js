import express from "express";
import { discoverBooks, proxyEpub } from "../controllers/bookController.js";
const router = express.Router();

// route for discovering books
router.get("/discover", discoverBooks);
router.get("/proxy", proxyEpub);

export default router;
