import express from "express";
import searchController from "../controllers/search.controller.js";
import authCtrl from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * @swagger
 * /api/search:
 *   get:
 *     tags:
 *       - Search
 *     summary: Search users and events
 *     description: Returns users and events matching the query parameter.
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search query
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Search results retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["user1", "user2"]
 *                     events:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["event1", "event2"]
 */
router.get("/", authCtrl.requireSignin, searchController.search);
export default router;