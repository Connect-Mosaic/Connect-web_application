import express from "express";
import authCtrl from "../controllers/auth.controller.js";
import conversationCtl from "../controllers/conversation.controller.js";

const router = express.Router();
/**
 * @swagger
 * /api/conversations:
 *   get:
 *     summary: Get user conversations
 *     tags:
 *       - Conversations
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User conversations retrieved
 *         content:
 *           application/json:
 *             examples:
 *               successResponse:
 *                 value:
 *                   success: true
 *                   message: "User conversations retrieved"
 *                   data:
 *                     - participant_user_id:
 *                         - "692cc5e4f9d1c76ecd9e486f"
 *                       conversation_id: "692ce2cbb29f99fdd6c11085"
 *                       last_message: "test send message to message2"
 *                       last_message_timestamp: "2025-12-01T00:40:14.052Z"
 *                       display_name: "send message to messageUser2"
 *                       display_image: "http://example.com.png"
 *                       unread_count: 0
 */

/**
 * @swagger
 * /api/conversations:
 *   post:
 *     summary: Create a new conversation
 *     tags:
 *       - Conversations
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             type: "private"
 *             participants:
 *               - "692cc5e4f9d1c76ecd9e486f"
 *             display_name: "displayName"
 *             display_image: "displayImg"
 *     responses:
 *       201:
 *         description: Conversation created successfully
 *         content:
 *           application/json:
 *             examples:
 *               successResponse:
 *                 value:
 *                   success: true
 *                   message: "Conversation created successfully"
 *                   data:
 *                     conversation_id: "692e133eb37bd722b0b632fb"
 */
router.route("/")
    .post(authCtrl.requireSignin, conversationCtl.createConversation)
    .get(authCtrl.requireSignin, conversationCtl.getUserConversations);

router.get("/:id", authCtrl.requireSignin, conversationCtl.getConversationById);
/**
 * @swagger
 * /api/conversations/{conversation_id}:
 *   put:
 *     summary: Update a conversation
 *     tags:
 *       - Conversations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversation_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the conversation to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             display_name: "test edit"
 *             display_image: "edit img URL"
 *     responses:
 *       200:
 *         description: Conversation updated successfully
 *         content:
 *           application/json:
 *             examples:
 *               successResponse:
 *                 value:
 *                   success: true
 *                   message: "Conversation updated successfully"
 *                   data: null
 */
router.put("/:id", authCtrl.requireSignin, conversationCtl.updateConversation);

/**
 * @swagger
 * /api/conversations/{conversation_id}:
 *   delete:
 *     summary: Delete a conversation
 *     tags:
 *       - Conversations
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: conversation_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the conversation to delete
 *     responses:
 *       200:
 *         description: Conversation deleted successfully
 *         content:
 *           application/json:
 *             examples:
 *               successResponse:
 *                 value:
 *                   success: true
 *                   message: "Conversation deleted successfully"
 *                   data: null
 */
router.delete("/:id", authCtrl.requireSignin, conversationCtl.deleteConversation);
export default router;
