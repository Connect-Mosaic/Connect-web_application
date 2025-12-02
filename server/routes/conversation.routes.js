import express from "express";
import { listConversations } from "../controllers/conversation.controller.js";

const router = express.Router();

// GET /api/conversations?userId=xxx
router.get("/", listConversations);

export default router;
