import express from "express";
import eventCont from "../controllers/events.controller.js";
import authCont from "../controllers/auth.controller.js";


const router = express.Router();

//LIST EVENT ITS PUBLIC

router.get("/", eventCont.list);

// CREATE PROTECTED EVENTS

router.post("/", authCont.requireSignin, eventCont.create);

// READ SINGLE EVENT (PUBLIC)
router.get("/:eventId", eventCont.read);

// UPDATE (PROTECTED)
router.put( "/:eventId",authCont.requireSignin,eventCont.update);

//DELETE (PROTECTED)
router.delete( "/:eventId",authCont.requireSignin,eventCont.remove);

//EVENT ID

router.param("eventId", eventCont.eventByID);

export default router;

