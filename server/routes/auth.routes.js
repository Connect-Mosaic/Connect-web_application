import express from "express";
import authCtrl from "../controllers/auth.controller.js";
const router = express.Router();
/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           example:
 *             first_name: "Albert Liu"
 *             last_name: " Liu"
 *             email: "albert5@example.com"
 *             password: "mypassword123"
 *             role: "student"
 *             interests:
 *               - "AI"
 *               - "Web Development"
 *               - "Cooking"
 *             university: "Centennial College"
 *             program: "Software Engineering"
 *             profile_picture: "https://example.com/avatar.jpg"
 *             bio: "I love building full-stack apps and exploring AI features."
 *             location: "Toronto, Canada"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RegisterResponse'
 *             example:
 *               success: true
 *               message: "User registered successfully"
 *               data:
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTFhNjZlYzQ5NTQ1MWRjOTVkOGU2YzUiLCJlbWFpbCI6ImFsYmVydDVAZXhhbXBsZS5jb20iLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc2MzMzNzk2NCwiZXhwIjoxNzYzNDI0MzY0fQ.71jcVZv6M-OBonGd4f5s0ZwFih7fvAI316rsajBi6SA"
 *                 user:
 *                   id: "691a66ec495451dc95d8e6c5"
 *                   first_name: "Albert Liu"
 *                   last_name: "Liu"
 *                   email: "albert5@example.com"
 *                   university: "Centennial College"
 *                   program: "Software Engineering"
 *                   interests:
 *                     - "AI"
 *                     - "Web Development"
 *                     - "Cooking"
 *                   location: "Toronto, Canada"
 *       400:
 *         description: Validation error / bad request
 *       409:
 *         description: Email already in use
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - email
 *         - password
 *         - role
 *       properties:
 *         first_name:
 *           type: string
 *           example: "Albert Liu"
 *         last_name:
 *           type: string
 *           example: "Liu"
 *         email:
 *           type: string
 *           format: email
 *           example: "albert5@example.com"
 *         password:
 *           type: string
 *           format: password
 *           example: "mypassword123"
 *         role:
 *           type: string
 *           example: "student"
 *         interests:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "AI"
 *             - "Web Development"
 *             - "Cooking"
 *         university:
 *           type: string
 *           example: "Centennial College"
 *         program:
 *           type: string
 *           example: "Software Engineering"
 *         profile_picture:
 *           type: string
 *           format: uri
 *           example: "https://example.com/avatar.jpg"
 *         bio:
 *           type: string
 *           example: "I love building full-stack apps and exploring AI features."
 *         location:
 *           type: string
 *           example: "Toronto, Canada"
 *
 *     UserSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "691a66ec495451dc95d8e6c5"
 *         first_name:
 *           type: string
 *           example: "Albert Liu"
 *         last_name:
 *           type: string
 *           example: "Liu"
 *         email:
 *           type: string
 *           format: email
 *           example: "albert5@example.com"
 *         university:
 *           type: string
 *           example: "Centennial College"
 *         program:
 *           type: string
 *           example: "Software Engineering"
 *         interests:
 *           type: array
 *           items:
 *             type: string
 *           example:
 *             - "AI"
 *             - "Web Development"
 *             - "Cooking"
 *         location:
 *           type: string
 *           example: "Toronto, Canada"
 *
 *     RegisterResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "User registered successfully"
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             user:
 *               $ref: '#/components/schemas/UserSummary'
 */
router.route("/register").post(authCtrl.register);
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Auth
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             user:
 *               email: "albert4@example.com"
 *               password: "mypassword123"
 *             rememberMe: "true"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             example:
 *               success: true
 *               message: "Login successful"
 *               data:
 *                 token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OTEzZTA0MzM5NjIyZmU1YWQxMzA3MDQiLCJlbWFpbCI6ImFsYmVydDRAZXhhbXBsZS5jb20iLCJyb2xlIjoic3R1ZGVudCIsImlhdCI6MTc2MzMzMzcxNywiZXhwIjoxNzYzOTM4NTE3fQ.muyAJdbAj-aW8EKhxVUL-5qTKx3fArQYOz-lgR6GUyo"
 *                 user:
 *                   id: "6913e04339622fe5ad130704"
 *                   email: "albert4@example.com"
 *       400:
 *         description: Validation error / bad request
 *       401:
 *         description: Invalid credentials
 *
 * components:
 *   schemas:
 *     LoginRequest:
 *       type: object
 *       required:
 *         - user
 *       properties:
 *         user:
 *           type: object
 *           required:
 *             - email
 *             - password
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               example: "albert4@example.com"
 *             password:
 *               type: string
 *               format: password
 *               example: "mypassword123"
 *         rememberMe:
 *           type: string
 *           description: Optional flag to persist session ("true"|"false")
 *           example: "true"
 *
 *     UserLoginSummary:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: "6913e04339622fe5ad130704"
 *         email:
 *           type: string
 *           format: email
 *           example: "albert4@example.com"
 *
 *     LoginResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Login successful"
 *         data:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *             user:
 *               $ref: '#/components/schemas/UserLoginSummary'
 */
router.route("/login").post(authCtrl.login);

/**
 * @swagger
 * /api/auth/logout:
 *   get:
 *     tags:
 *       - Auth
 *     summary: Logout a user
 *     responses:
 *       200:
 *         description: Logout successful
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
 *                   example: "Logout successful"
 */
router.route("/logout").get(authCtrl.logout);
export default router;
