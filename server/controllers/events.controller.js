import extend from "lodash/extend.js";
import errorHandler from "./error.controller.js";
import { successResponse, errorResponse } from '../helpers/apiResponse.js';
import Event from "../models/events.model.js";

const create = async (req, res) => {
    try {
        const event = new Event(req.body);
        if (req.auth && req.auth.userId) event.organizer = req.auth.userId;
        await event.save();
        return res.json(successResponse('Event created successfully', event));
    } catch (err) {
        console.error('[Event:create] Error:', err);
        return res.status(500).json(errorResponse(errorHandler(err)));
    }
};

const list = async (req, res) => {
    try {
        const events = await Event.find().select("title location date startTime endTime organizer").populate('organizer', 'name email').exec();
        let responseList = events.map(event => ({
            id: event._id,
            title: event.title,
            location: event.location,
            date: event.date,
            startTime: event.startTime,
            endTime: event.endTime,
            organizer: event.organizer,
            interests: event.interests,
            image: event.image
        }));
        return res.json(successResponse('Events retrieved successfully', responseList));
    } catch (err) {
        console.error('[Event:list] Error:', err);
        return res.status(500).json(errorResponse('An error occurred while fetching events'));
    }
};

const eventByID = async (req, res) => {
    try {
        const id = req.params.eventId;
        const event = await Event.findById(id).populate('organizer', 'first_name last_name email').populate('participants', 'first_name last_name email').exec();
        if (!event) return res.status(404).json(errorResponse('Event not found'));
        return res.json(successResponse('Event retrieved successfully', event));
    } catch (err) {
        console.error('[Event:eventByID] Error:', err);
        return res.status(500).json(errorResponse('Error loading event'));
    }
};


const update = async (req, res) => {
    try {
        let event = req.event;
        event = extend(event, req.body);
        await event.save();
        return res.json(successResponse('Event updated successfully', event));
    } catch (err) {
        console.error('[Event:update] Error:', err);
        return res.status(500).json(errorResponse(errorHandler(err)));
    }
};

const remove = async (req, res) => {
    try {
        const event = req.event;
        await event.remove();
        return res.json(successResponse('Event deleted successfully', event));
    } catch (err) {
        console.error('[Event:remove] Error:', err);
        return res.status(500).json(errorResponse('An error occurred while deleting event'));
    }
};

const search = async (req, res) => {
    try {
        const q = req.query.q || '';
        const regex = new RegExp(q, 'i');
        const events = await Event.find({
            $or: [{ title: regex }]
        }).populate('organizer', 'name email').exec();
        return res.json(successResponse('Search results retrieved successfully', { events }));
    } catch (err) {
        console.error('[Event:search] Error:', err);
        return res.status(500).json(errorResponse('An error occurred while searching events'));
    }
};

const joinEvent = async (req, res) => {
    try {
        console.log('[Event:joinEvent] Incoming request', {
            userId: req?.auth?.userId,
            eventId: req?.params?.eventId,
            bodyPreview: req?.body ? Object.keys(req.body) : undefined
        });

        const userId = req.auth && req.auth.userId;
        const eventId = req.params.eventId;

        if (!userId) {
            console.warn('[Event:joinEvent] Missing authenticated user');
            return res.json(errorResponse('Unauthorized'));
        }

        console.log(`[Event:joinEvent] Looking up event ${eventId} for user ${userId}`);
        const event = await Event.findById(eventId);

        if (!event) {
            console.warn(`[Event:joinEvent] Event not found: ${eventId}`);
            return res.json(errorResponse('Event not found'));
        }

        console.log('[Event:joinEvent] Event loaded', {
            id: event._id,
            participantsCount: event.participants.length,
            capacity: event.capacity
        });

        if (event.participants.includes(userId)) {
            console.info('[Event:joinEvent] User already joined', { userId, eventId });
            return res.json(errorResponse('Already joined this event'));
        }

        if (typeof event.capacity === 'number' && event.participants.length >= event.capacity) {
            console.info('[Event:joinEvent] Event full', { eventId, capacity: event.capacity });
            return res.json(errorResponse('Event is full'));
        }

        event.participants.push(userId);
        await event.save();

        console.log('[Event:joinEvent] User added to event participants', {
            userId,
            eventId,
            newParticipantsCount: event.participants.length
        });

        return res.json(successResponse('Successfully joined the event', { eventId, userId }));

    } catch (error) {
        return res.json(errorResponse(error.message));
    }
};

export default {
    create,
    list,
    eventByID,
    update,
    remove,
    search,
    joinEvent
};