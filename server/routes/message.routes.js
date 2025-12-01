import express from "express";
import authCtrl from "../controllers/auth.controller.js";
import messageCtl from "../controllers/message.controller.js";


const router = express.Router();
/**
 * @swagger
 * /api/messages:
 *   post:
 *     tags:
 *       - Messages
 *     summary: Send a new message
 *     description: Create and send a message in a conversation.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           example:
 *             conversation_id: "692e133eb37bd722b0b632fb"
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
router.post("/", authCtrl.requireSignin, messageCtl.sendMessage);
/**
 * @swagger
 * /api/messages/{conversation_id}:
 *   get:
 *     tags:
 *       - Messages
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
router.get("/:conversation_id", authCtrl.requireSignin, messageCtl.getMessages);
router.put("/:message_id/read", authCtrl.requireSignin, messageCtl.markAsRead); // not used currently
/**
 * @swagger
 * /api/messages/{message_id}:
 *   put:
 *     tags:
 *       - Messages
 *     summary: Edit an existing message
 *     description: Update the content of a message by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
router.put("/:message_id", authCtrl.requireSignin, messageCtl.editMessage);

/**
 * @swagger
 * /api/messages/{message_id}:
 *   delete:
 *     tags:
 *       - Messages
 *     summary: Delete a message
 *     description: Delete a message by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
router.delete("/:message_id", authCtrl.requireSignin, messageCtl.deleteMessage);

export default router;
