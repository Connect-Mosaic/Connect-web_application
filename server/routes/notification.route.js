import express from "express";
import notificationController from "../controllers/notification.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     summary: Create a notification
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           examples:
 *             notification:
 *               value:
 *                 title: "New Event"
 *                 message: "Your event starts in 10 minutes."
 *                 type: "info"
 *     responses:
 *       200:
 *         description: Notification created successfully
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "Notification created successfully"
 *                   data:
 *                     notification:
 *                       userId: "692cc5b8f9d1c76ecd9e486c"
 *                       title: "New Event"
 *                       message: "Your event starts in 10 minutes."
 *                       type: "info"
 *                       isRead: false
 *                       _id: "692f8d13028255427b9250d7"
 *                       created_at: 1764723987
 *                       updated_at: 1764723987
 *                       __v: 0
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized - Bearer token missing or invalid
 */
router.post("/", authCtrl.requireSignin, notificationController.createNotification);
/**
 * @swagger
 * /api/notifications:
 *   get:
 *     summary: Retrieve notifications
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "Notifications retrieved successfully"
 *                   data:
 *                     notifications:
 *                       - notification_id: "692f8d13028255427b9250d7"
 *                         title: "New Event"
 *                         message: "Your event starts in 10 minutes."
 *                         type: "info"
 *                         is_read: false
 *                         created_at: 1764723987
 *                         updated_at: 1764723987
 *       400:
 *         description: Bad Request
 *       401:
 *         description: Unauthorized - Bearer token missing or invalid
 */
router.get("/", authCtrl.requireSignin, notificationController.getNotifications);

/**
 * @swagger
 * /api/notifications/mark-all-read:
 *   put:
 *     summary: Mark all notifications as read
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notification mark all read successful
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "Notification mark all read successful"
 *                   data: null
 *       401:
 *         description: Unauthorized - Bearer token missing or invalid
 */
router.put("/mark-all-read", authCtrl.requireSignin, notificationController.markAllRead);
/**
 * @swagger
 * /api/notifications/{notification_id}:
 *   get:
 *     summary: Retrieve a notification
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notification_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the notification to retrieve
 *     responses:
 *       200:
 *         description: Notification retrieved successfully
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "Notification retrieved successfully"
 *                   data:
 *                     notification:
 *                       _id: "692f8be3a6f4a3726ace782d"
 *                       userId: "692cc5b8f9d1c76ecd9e486c"
 *                       title: "New Event"
 *                       message: "Your event starts in 10 minutes."
 *                       type: "info"
 *                       isRead: false
 *                       created_at: 1764723683
 *                       updated_at: 1764723683
 *                       __v: 0
 *       401:
 *         description: Unauthorized - Bearer token missing or invalid
 *       404:
 *         description: Notification not found
 */
router.get("/:notification_id", authCtrl.requireSignin, notificationController.getNotificationById);
/**
 * @swagger
 * /api/notifications/{notification_id}/read:
 *   put:
 *     summary: Mark a notification as read
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notification_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the notification to mark as read
 *     responses:
 *       200:
 *         description: Notification marked as read
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "Notification marked as read"
 *                   data:
 *                     notification:
 *                       _id: "692f8be3a6f4a3726ace782d"
 *                       userId: "692cc5b8f9d1c76ecd9e486c"
 *                       title: "New Event"
 *                       message: "Your event starts in 10 minutes."
 *                       type: "info"
 *                       isRead: true
 *                       created_at: 1764723683
 *                       updated_at: 1764723683
 *                       __v: 0
 *       401:
 *         description: Unauthorized - Bearer token missing or invalid
 *       404:
 *         description: Notification not found
 */
router.put("/:notification_id/read", authCtrl.requireSignin, notificationController.markAsRead);


/**
 * @swagger
 * /api/notifications/{notification_id}:
 *   delete:
 *     summary: Delete a notification
 *     tags:
 *       - Notifications
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notification_id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the notification to delete
 *     responses:
 *       200:
 *         description: Notification deleted
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 value:
 *                   success: true
 *                   message: "Notification deleted"
 *                   data:
 *                     notification_id: "692f8be3a6f4a3726ace782d"
 *       401:
 *         description: Unauthorized - Bearer token missing or invalid
 *       404:
 *         description: Notification not found
 */
router.delete("/:notification_id", authCtrl.requireSignin, notificationController.deleteNotification);




export default router;