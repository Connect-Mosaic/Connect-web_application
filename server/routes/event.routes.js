import express from "express";
import eventCont from "../controllers/events.controller.js";
import authCont from "../controllers/auth.controller.js";


const router = express.Router();

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags:
 *       - Events
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Coding Meetup
 *               description:
 *                 type: string
 *                 example: A friendly event for beginners to learn JavaScript.
 *               city:
 *                 type: string
 *                 example: Toronto
 *               location:
 *                 type: string
 *                 example: 123 College St, Toronto, ON
 *               coordinates:
 *                 type: object
 *                 properties:
 *                   lat:
 *                     type: number
 *                     example: 43.6532
 *                   lng:
 *                     type: number
 *                     example: -79.3832
 *               date:
 *                 type: string
 *                 format: date
 *                 example: 2025-12-20
 *               startTime:
 *                 type: string
 *                 example: "18:00"
 *               endTime:
 *                 type: string
 *                 example: "21:00"
 *               interests:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["coding", "network", "javascript"]
 *               image:
 *                 type: string
 *                 example: "https://example.com/event.jpg"
 *               capacity:
 *                 type: number
 *                 example: 50
 *               createdBy:
 *                 type: string
 *                 example: 674b3f1351fc0afacec12345
 *               visibility:
 *                 type: string
 *                 enum: [public, university-only]
 *                 example: public
 *     responses:
 *       '201':
 *         description: Event created successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Event created successfully
 *               event:
 *                 _id: 675aaaa789c99f22aabc1234
 *                 title: Coding Meetup
 *                 city: Toronto
 *                 capacity: 50
 *                 date: 2025-12-20
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Retrieve a list of events
 *     tags:
 *       - Events
 *     responses:
 *       '200':
 *         description: Events retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Events retrieved successfully
 *               data:
 *                 - id: "6929878162e4d2f6c451ebaf"
 *                   title: "AI Workshop: Build Your First Chatbot"
 *                   location: "100 King St W, Toronto, ON"
 *                   date: "2025-12-01T00:00:00.000Z"
 *                   startTime: "14:00"
 *                   endTime: "17:00"
 *                   organizer:
 *                     _id: "6920e1eb6616a340293777ff"
 *                     email: "testuser@example.com"
 *                   coordinates:
 *                     lat: 43.73421522946456
 *                     lng: -79.35428474823435
 */

/**
 * @swagger
 * /api/events/{eventId}:
 *   get:
 *     summary: Retrieve a single event by ID
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event to retrieve
 *     responses:
 *       '200':
 *         description: Event retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Event retrieved successfully
 *               data:
 *                 coordinates:
 *                   lat: 43.6487
 *                   lng: -79.3854
 *                 _id: "6929878162e4d2f6c451ebaf"
 *                 title: "AI Workshop: Build Your First Chatbot"
 *                 description: "A beginner-friendly workshop teaching students how to build AI chatbots using Node.js and OpenAI APIs."
 *                 city: "Toronto"
 *                 location: "100 King St W, Toronto, ON"
 *                 date: "2025-12-01T00:00:00.000Z"
 *                 startTime: "14:00"
 *                 endTime: "17:00"
 *                 interests:
 *                   - "coding"
 *                   - "AI"
 *                   - "chatbot"
 *                 image: "https://example.com/ai-workshop.png"
 *                 capacity: 80
 *                 participants:
 *                   - _id: "69298c2e94632fc91d3b46f7"
 *                     first_name: "Eric 123"
 *                     last_name: "Liu"
 *                     email: "testusereric@example.com"
 *                 visibility: "public"
 *                 organizer:
 *                   _id: "6920e1eb6616a340293777ff"
 *                   first_name: "Albert Liu"
 *                   last_name: "Liu"
 *                   email: "testuser@example.com"
 *                 createdAt: "2025-11-28T11:29:05.862Z"
 *                 updatedAt: "2025-11-28T11:55:30.774Z"
 *                 __v: 1
 */
/**
 * @swagger
 * /api/events/{eventId}/join:
 *   post:
 *     summary: Join an event
 *     tags:
 *       - Events
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the event to join
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully joined the event
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Successfully joined the event
 *               data:
 *                 eventId: "6929878162e4d2f6c451ebaf"
 *                 userId: "69298c2e94632fc91d3b46f7"
 *       '401':
 *         description: Unauthorized - user must be authenticated
 *       '404':
 *         description: Event not found
 */
router.route("/")
    .get(eventCont.list)
    .post(authCont.requireSignin, eventCont.create);
/**
 * @swagger
 * /api/events/search:
 *   get:
 *     summary: Search events by query
 *     tags:
 *       - Events
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: Search term to filter events by title, description, city, interests, etc.
 *     responses:
 *       '200':
 *         description: Search results retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               success: true
 *               message: Search results retrieved successfully
 *               data:
 *                 events:
 *                   - coordinates:
 *                       lat: 43.6487
 *                       lng: -79.3854
 *                     _id: "6929878162e4d2f6c451ebaf"
 *                     title: "AI Workshop: Build Your First Chatbot"
 *                     description: "A beginner-friendly workshop teaching students how to build AI chatbots using Node.js and OpenAI APIs."
 *                     city: "Toronto"
 *                     location: "100 King St W, Toronto, ON"
 *                     date: "2025-12-01T00:00:00.000Z"
 *                     startTime: "14:00"
 *                     endTime: "17:00"
 *                     interests:
 *                       - "coding"
 *                       - "AI"
 *                       - "chatbot"
 *                     image: "https://example.com/ai-workshop.png"
 *                     capacity: 80
 *                     participants:
 *                       - "69298c2e94632fc91d3b46f7"
 *                       - "691923e87176ae6f6aabafe5"
 *                       - "692a0fec11e691da009eaba1"
 *                       - "691a8f18233bfa6b437a7432"
 *                       - "691a6e77c2444f39a6705da2"
 *                     visibility: "public"
 *                     organizer:
 *                       _id: "6920e1eb6616a340293777ff"
 *                       first_name: "Albert Liu"
 *                       last_name: "Liu"
 *                       email: "testuser@example.com"
 *                     createdAt: "2025-11-28T11:29:05.862Z"
 *                     updatedAt: "2025-12-01T15:10:33.698Z"
 *                     __v: 5
 */
router.get("/search", eventCont.searchEvents);
router.post("/:eventId/join", authCont.requireSignin, eventCont.joinEvent);
router.route("/:eventId")
    .get(eventCont.eventByID)
    .put(authCont.requireSignin, eventCont.update)
    .delete(authCont.requireSignin, eventCont.remove);






export default router;

