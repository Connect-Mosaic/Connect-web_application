import extend from "lodash/extend.js";
import errorHandler from "./error.controller.js";
import { successResponse, errorResponse } from "../helpers/apiResponse.js";
import Event from "../models/events.model.js";
import { geocodeAddress } from "../helpers/geocode.js";
import mongoose from "mongoose";

/* ============================================================
   CREATE EVENT
============================================================ */
const create = async (req, res) => {
    try {
        const event = new Event(req.body);
        if (req.auth?.userId) event.organizer = req.auth.userId;

        // Autogeocode if missing coordinates
        if ((!event.coordinates || !event.coordinates.lat) && event.location) {
            try {
                const coords = await geocodeAddress(event.location);
                if (coords) {
                    event.coordinates = coords;
                }
            } catch (err) {
                console.error("[Event:create] Geocode failed:", err);
            }
        }

        await event.save();
        return res.json(successResponse("Event created successfully", event));
    } catch (err) {
        console.error("[Event:create] Error:", err);
        return res.status(500).json(errorResponse(errorHandler(err)));
    }
};

/* ============================================================
   LIGHTWEIGHT EVENT LIST (MAP PAGE USES THIS)
   *** DO NOT MODIFY FORMAT OR KEYS ***
============================================================ */
const list = async (req, res) => {
    try {
        const events = await Event.find()
            .select("_id title date startTime endTime location image coordinates organizer")
            .populate("organizer", "first_name last_name email")
            .lean();

        const output = events.map(e => ({
            id: e._id,
            title: e.title,
            date: e.date || null,
            startTime: e.startTime || null,
            endTime: e.endTime || null,
            location: e.location,
            image: e.image,
            organizer: e.organizer,
            coordinates: e.coordinates || null,
        }));

        return res.json(successResponse("Events retrieved successfully", output));
    } catch (err) {
        console.error("[Event:list] Error:", err);
        return res.status(500).json(errorResponse("Failed to fetch events"));
    }
};

/* ============================================================
   FULL EVENT LIST (EVENT PAGE USES THIS)
============================================================ */
const listFull = async (req, res) => {
    try {
        const events = await Event.find()
            .populate("organizer", "first_name last_name email")
            .populate("participants", "first_name last_name email")
            .lean();

        const formatted = events.map(e => ({
            id: e._id,
            title: e.title,
            description: e.description,
            location: e.location,
            city: e.city,
            date: e.date,
            startTime: e.startTime,
            endTime: e.endTime,
            organizer: e.organizer,
            participants: e.participants ?? [],
            interests: e.interests,
            image: e.image,
            capacity: e.capacity,
            visibility: e.visibility,
            coordinates: e.coordinates ?? null,
        }));

        return res.json(successResponse("Full event list retrieved", formatted));
    } catch (err) {
        console.error("[Event:listFull] Error:", err);
        return res.status(500).json(errorResponse("Failed to fetch full events"));
    }
};

/* ============================================================
   GET EVENT BY ID
============================================================ */
const eventByID = async (req, res) => {
    try {
        const id = req.params.eventId;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json(errorResponse("Invalid event id"));
        }

        const event = await Event.findById(id)
            .populate("organizer", "first_name last_name email")
            .populate("participants", "first_name last_name email");

        if (!event) return res.status(404).json(errorResponse("Event not found"));

        return res.json(successResponse("Event retrieved successfully", event));
    } catch (err) {
        console.error("[Event:eventByID] Error:", err);
        return res.status(500).json(errorResponse("Failed to retrieve event"));
    }
};

/* ============================================================
   UPDATE EVENT
============================================================ */
const update = async (req, res) => {
    try {
        let event = req.event;
        event = extend(event, req.body);
        await event.save();

        return res.json(successResponse("Event updated successfully", event));
    } catch (err) {
        console.error("[Event:update] Error:", err);
        return res.status(500).json(errorResponse(errorHandler(err)));
    }
};

/* ============================================================
   DELETE EVENT
============================================================ */
const remove = async (req, res) => {
    try {
        await req.event.remove();
        return res.json(successResponse("Event deleted successfully", {}));
    } catch (err) {
        console.error("[Event:remove] Error:", err);
        return res.status(500).json(errorResponse("Failed to delete event"));
    }
};

/* ============================================================
   JOIN EVENT
============================================================ */
const joinEvent = async (req, res) => {
    try {
        const userId = req.auth?.userId;
        const eventId = req.params.eventId;

        if (!userId) return res.json(errorResponse("Unauthorized"));

        const event = await Event.findById(eventId);
        if (!event) return res.json(errorResponse("Event not found"));

        if (event.participants.includes(userId)) {
            return res.json(errorResponse("Already joined this event"));
        }

        event.participants.push(new mongoose.Types.ObjectId(userId));
        await event.save();

        return res.json(
            successResponse("Successfully joined event", { eventId, userId })
        );
    } catch (err) {
        console.error("[Event:joinEvent] Error:", err);
        return res.json(errorResponse("Failed to join event"));
    }
};

/* ============================================================
   LEAVE EVENT
============================================================ */
const leaveEvent = async (req, res) => {
    try {
        const userId = req.auth?.userId;
        const eventId = req.params.eventId;

        if (!userId) return res.json(errorResponse("Unauthorized"));

        const event = await Event.findById(eventId);
        if (!event) return res.json(errorResponse("Event not found"));

        event.participants = event.participants.filter(
            p => p.toString() !== userId.toString()
        );

        await event.save();

        return res.json(
            successResponse("Left event", { eventId, userId })
        );
    } catch (err) {
        console.error("[Event:leaveEvent] Error:", err);
        return res.json(errorResponse("Failed to leave event"));
    }
};

/* ============================================================
   SEARCH
============================================================ */
const searchEvents = async (req, res) => {
    try {
        const q = req.query.q ?? "";
        const regex = new RegExp(q, "i");

        const events = await Event.find({
            $or: [{ title: regex }, { location: regex }]
        })
        .populate("organizer", "first_name last_name email");

        return res.json(successResponse("Search results", events));
    } catch (err) {
        console.error("[Event:searchEvents] Error:", err);
        return res.json(errorResponse("Search failed"));
    }
};

export default {
    create,
    list,          // KEEP FOR MAP PAGE
    listFull,      // USE FOR EVENT PAGE
    eventByID,
    update,
    remove,
    joinEvent,
    leaveEvent,
    searchEvents
};
