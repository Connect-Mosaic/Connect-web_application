import express from "express";
import authCtrl from "../controllers/auth.controller.js";
import conversationCtl from "../controllers/conversation.controller.js";
import messageCtl from "../controllers/message.controller.js";



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

router.get("/:conversation_id", authCtrl.requireSignin, conversationCtl.getConversationById);
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
router.put("/:conversation_id", authCtrl.requireSignin, conversationCtl.updateConversation);

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
router.delete("/:conversation_id", authCtrl.requireSignin, conversationCtl.deleteConversation);

/**
 * @swagger
 * /api/conversations/{conversation_id}/messages:
 *   post:
 *     tags:
 *       - Conversations
 *     summary: Send a new message
 *     description: Create and send a message in a conversation.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             content: "send text "
 *     responses:
 *       200:
 *         description: Message sent
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Message sent"
 *               data: null
 *       401:
 *         description: Unauthorized - missing or invalid Bearer token
 */


/**
 * @swagger
 * /api/conversations/{conversation_id}/messages:
 *   get:
 *     tags:
 *       - Conversations
 *     summary: Retrieve messages for a conversation
 *     description: Returns a list of messages for the given conversation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: conversation_id
 *         in: path
 *         required: true
 *         description: Conversation ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Messages retrieved
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Messages retrieved"
 *               data:
 *                 - message_id: "692ce31ab29f99fdd6c1108e"
 *                   conversation_id: "692ce2a3b29f99fdd6c11081"
 *                   sender: "6920e1eb6616a340293777ff"
 *                   content: "hello messageUser1 how are you"
 *                   been_read: true
 *                   edited: false
 *                   timestamp: "2025-12-01T00:36:42.140Z"
 *                 - message_id: "692ceb065f6d9a1a32b12b22"
 *                   conversation_id: "692ce2a3b29f99fdd6c11081"
 *                   sender: "6920e1eb6616a340293777ff"
 *                   content: "hello "
 *                   been_read: false
 *                   edited: false
 *                   timestamp: "2025-12-01T01:10:30.223Z"
 *                 - message_id: "692ceb0c5f6d9a1a32b12b2b"
 *                   conversation_id: "692ce2a3b29f99fdd6c11081"
 *                   sender: "6920e1eb6616a340293777ff"
 *                   content: "is "
 *                   been_read: true
 *                   edited: false
 *                   timestamp: "2025-12-01T01:10:36.549Z"
 *                 - message_id: "692ceb0f5f6d9a1a32b12b34"
 *                   conversation_id: "692ce2a3b29f99fdd6c11081"
 *                   sender: "6920e1eb6616a340293777ff"
 *                   content: "me "
 *                   been_read: false
 *                   edited: false
 *                   timestamp: "2025-12-01T01:10:39.978Z"
 *       401:
 *         description: Unauthorized - missing or invalid Bearer token
 *       404:
 *         description: Conversation not found
 */
router.route("/:conversation_id/messages")
    .post(authCtrl.requireSignin, messageCtl.sendMessage)
    .get(authCtrl.requireSignin, messageCtl.getMessages);
/**
 * @swagger
 * /api/conversations/{conversation_id}/messages/{message_id}:
 *   put:
 *     tags:
 *       - Conversations
 *     summary: Edit an existing message
 *     description: Update the content of a message by its ID within a conversation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: conversation_id
 *         in: path
 *         required: true
 *         description: Conversation ID
 *         schema:
 *           type: string
 *       - name: message_id
 *         in: path
 *         required: true
 *         description: Message ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             content: "test edit message for user1"
 *     responses:
 *       200:
 *         description: Message edited
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Message edited"
 *               data: null
 *       401:
 *         description: Unauthorized - missing or invalid Bearer token
 *       404:
 *         description: Message not found
 */
router.put("/:conversation_id/messages/:message_id", authCtrl.requireSignin, messageCtl.editMessage);
/**
 * @swagger
 * /api/conversations/{conversation_id}/messages/{message_id}:
 *   delete:
 *     tags:
 *       - Conversations
 *     summary: Delete a message
 *     description: Delete a message by its ID within a conversation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: conversation_id
 *         in: path
 *         required: true
 *         description: Conversation ID
 *         schema:
 *           type: string
 *       - name: message_id
 *         in: path
 *         required: true
 *         description: Message ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Message deleted
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Message deleted successfully"
 *               data: null
 *       401:
 *         description: Unauthorized - missing or invalid Bearer token
 *       404:
 *         description: Message not found
 */
router.delete("/:conversation_id/messages/:message_id", authCtrl.requireSignin, messageCtl.deleteMessage);
export default router;
