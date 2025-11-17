import express from "express";
import userCtrl from "../controllers/user.controller.js";
import authCtrl from "../controllers/auth.controller.js";
const router = express.Router();
router.post("/", userCtrl.create);
router.get("/", userCtrl.list);
/**
 * @swagger
 * /api/user/{userId}:
 *   get:
 *     summary: Retrieve a single user by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the user
 *         example: 6913e04339622fe5ad130704
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User object
 *         content:
 *           application/json:
 *             example:
 *               _id: "6913e04339622fe5ad130704"
 *               name: "Albert Liu"
 *               email: "albert4@example.com"
 *               role: "student"
 *               interests:
 *                 - "AI"
 *                 - "Web Development"
 *                 - "Cooking"
 *               university: "Centennial College"
 *               program: "Software Engineering"
 *               location: "Toronto, Canada"
 *               createdAt: 1762910275
 *               updatedAt: 1762910275
 *               __v: 0
 *       401:
 *         description: Unauthorized - authentication required
 *       404:
 *         description: User not found
 */
/**
 * @swagger
 * /api/user/{userId}:
 *   put:
 *     summary: Update a user's profile by ID
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the user to update
 *         example: 6913e04339622fe5ad130704
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *                 example: Albert Liu
 *               last_name:
 *                 type: string
 *                 example: Liu test
 *               email:
 *                 type: string
 *                 format: email
 *                 example: albert4@example.com
 *               password:
 *                 type: string
 *                 example: mypassword123
 *               role:
 *                 type: string
 *                 example: student
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["AI", "Web Development", "Cooking", "aaa"]
 *               university:
 *                 type: string
 *                 example: Centennial College
 *               program:
 *                 type: string
 *                 example: Software Engineering
 *               profile_picture_url:
 *                 type: string
 *                 format: uri
 *                 example: https://example.com/avatar.jpg
 *               bio:
 *                 type: string
 *                 example: I love building full-stack apps and exploring AI features.
 *               location:
 *                 type: string
 *                 example: Toronto, Canada
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: "User updated successfully"
 *               data:
 *                 _id: "6913e04339622fe5ad130704"
 *                 name: "Albert Liu"
 *                 email: "albert4@example.com"
 *                 role: "student"
 *                 interests:
 *                   - "AI"
 *                   - "Web Development"
 *                   - "Cooking"
 *                   - "aaa"
 *                 university: "Centennial College"
 *                 program: "Software Engineering"
 *                 location: "Toronto, Canada"
 *                 createdAt: 1762910275
 *                 updatedAt: 1763335878348
 *                 __v: 1
 *                 bio: "I love building full-stack apps and exploring AI features."
 *                 first_name: "Albert Liu"
 *                 last_name: "Liu test"
 *                 profile_picture_url: "https://example.com/avatar.jpg"
 *       400:
 *         description: Bad request - validation failed
 *       401:
 *         description: Unauthorized - authentication required
 *       404:
 *         description: User not found
 */
router
  .route("/:userId")
  .get(authCtrl.requireSignin, userCtrl.read)
  .put(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.update)
  .delete(authCtrl.requireSignin, authCtrl.hasAuthorization, userCtrl.remove);

router.param("userId", userCtrl.userByID);

export default router;
