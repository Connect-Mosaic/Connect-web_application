import express from "express";
import authCtrl from "../controllers/auth.controller.js";
import conversationCtl from "../controllers/conversation.controller.js";

const router = express.Router();
router.route("/")
    .post(authCtrl.requireSignin, conversationCtl.createConversation)
    .get(authCtrl.requireSignin, conversationCtl.getUserConversations);
router.get("/:id", authCtrl.requireSignin, conversationCtl.getConversationById);
router.put("/:id", authCtrl.requireSignin, conversationCtl.updateConversation);
router.delete("/:id", authCtrl.requireSignin, conversationCtl.deleteConversation);
export default router;
