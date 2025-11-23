import extend from "lodash/extend.js";
import errorHandler from "./error.controller.js";
import { successResponse, errorResponse } from '../helpers/apiResponse.js';

// user and event models
import User from "../models/user.model.js";
// import Event from "../models/events.model.js";
const search = async (req, res) => {
    try {
        console.log('[Search] search called with query:', req.query.q, 'by user id:', req.auth.userId);
        const query = req.query.q;
        // event not prepare for search yet create dummy array
        let userResults = ['user1', 'user2'];
        let eventResults = ['event1', 'event2'];
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