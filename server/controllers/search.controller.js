import extend from "lodash/extend.js";
import errorHandler from "./error.controller.js";
import { successResponse, errorResponse } from '../helpers/apiResponse.js';
import Event from "../models/events.model.js";
import User from "../models/user.model.js";
const search = async (req, res) => {
    try {
        console.log('[Search] search called with query:', req.query.q, 'by user id:', req.auth.userId);
        const query = req.query.q;
        if (!query) {
            return res.status(400).json(errorResponse('Search query parameter "q" is required'));
        }
        // Search users by name 
        const userResults = await User.find({
            $or: [
                { first_name: { $regex: query, $options: 'i' } },
                { last_name: { $regex: query, $options: 'i' } }
            ]
        }).select('first_name last_name email university program interests location profile_picture').exec();

        // Search events by title
        const eventResults = await Event.find({
            title: { $regex: query, $options: 'i' }
        }).select('title location date startTime endTime interests location image').exec();

        return res.json(successResponse('Search results retrieved successfully', {
            users: userResults,
            events: eventResults
        }));
    } catch (error) {
        console.error('[Search] Error during search:', error);
        return res.status(500).json(errorResponse('An error occurred while searching'));
    }
};

export default {
    search
};  