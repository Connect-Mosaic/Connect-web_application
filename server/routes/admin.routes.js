import express from "express";
import authCtrl from "../controllers/auth.controller.js";
import adminController from "../controllers/admin.controller.js";


const router = express.Router();
/**
 * @swagger
 * tags:
 *   - name: Admin
 *     description: Admin endpoints
 */

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get a list of users
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful response with user list
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Users retrieved successfully"
 *               data:
 *                 - id: "6913dec069dc4eef8d25c619"
 *                   name: "undefined undefined"
 *                   email: "admin@example.com"
 *                   role: "admin"
 *                   location: "Toronto, Canada"
 *                   joined_events:
 *                     - "event1"
 *                     - "event2"
 *                   status: "active"
 *                   updated: 1762909888
 *                   created: 1762909888
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */

router.get("/users", authCtrl.requireSignin, authCtrl.requireAdminAccess, adminController.userList);


/**
 * @swagger
 * /api/admin/users/{userId}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *           example: "6913dec069dc4eef8d25c619"
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "User deleted successfully"
 *               data: null
 */

router.delete("/users/:userId", authCtrl.requireSignin, authCtrl.requireAdminAccess, adminController.deleteUser);

/**
 * @swagger
 * /api/admin/users/{userId}/ban:
 *   post:
 *     summary: Ban a user by ID
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: ID of the user to ban
 *         schema:
 *           type: string
 *           example: "6913dec069dc4eef8d25c619"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 example: "Violation of community guidelines"
 *               duration:
 *                 type: string
 *                 description: "Ban duration (e.g. '7d' for 7 days). Use 'permanent' for indefinite ban."
 *                 example: "7d"
 *           example:
 *             reason: "Violation of community guidelines"
 *             duration: "7d"
 *     responses:
 *       '200':
 *         description: User banned successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "User banned successfully"
 *               data:
 *                 userId: "6913dec069dc4eef8d25c619"
 *                 status: "banned"
 */
router.delete("/users/:userId/ban", authCtrl.requireSignin, authCtrl.requireAdminAccess, adminController.banUser);


/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get dashboard metrics
 *     tags:
 *       - Admin
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Dashboard data retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "Dashboard data retrieved successfully"
 *               data:
 *                 total_users: 1200
 *                 active_users_today: 150
 *                 new_signups_this_week: 75
 *                 new_signups_this_month: 300
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 */
router.get("/dashboard", authCtrl.requireSignin, authCtrl.requireAdminAccess, adminController.dashboard);

// Admin setup routes
router.get("/settings", authCtrl.requireSignin, authCtrl.requireAdminAccess, adminController.getSettings);
router.post("/settings/general", authCtrl.requireSignin, authCtrl.requireAdminAccess, adminController.updateGeneralSettings);
router.post("/settings/email", authCtrl.requireSignin, authCtrl.requireAdminAccess, adminController.updateEmailSettings);
router.post("/settings/security", authCtrl.requireSignin, authCtrl.requireAdminAccess, adminController.updateSecuritySettings);
router.post("/create-admin", authCtrl.requireSignin, authCtrl.requireAdminAccess, adminController.createAdminUser);
router.post("/test-email", authCtrl.requireSignin, authCtrl.requireAdminAccess, adminController.testEmailConnection);

export default router;
