import express from "express";
import authCtrl from "../controllers/auth.controller.js";
import messageCtl from "../controllers/message.controller.js";


const router = express.Router();

router.post("/", authCtrl.requireSignin, messageCtl.sendMessage);
router.get("/:conversation_id", authCtrl.requireSignin, messageCtl.getMessages);
router.put("/:message_id/read", authCtrl.requireSignin, messageCtl.markAsRead);
router.put("/:message_id", authCtrl.requireSignin, messageCtl.editMessage);
router.delete("/:message_id", authCtrl.requireSignin, messageCtl.deleteMessage);

export default router;
