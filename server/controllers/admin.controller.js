import User from "../models/user.model.js";
import extend from "lodash/extend.js";
import errorHandler from "./error.controller.js";
import { successResponse, errorResponse } from '../helpers/apiResponse.js';
const userList = async (req, res) => {
    try {
        console.log('[Admin] userList called by admin user id:', req.auth.userId);
        let users = await User.find().select("first_name last_name email role location status updatedAt createdAt");
        let responseList = users.map(user => ({
            id: user._id,
            name: user.first_name + ' ' + user.last_name,
            email: user.email,
            role: user.role,
            location: user.location,
            joined_events: ['event1', 'event2'], // Placeholder for joined events
            status: user.status || 'active', // Assuming status field exists
            updated: user.updatedAt,
            created: user.createdAt
        }));
        res.json(successResponse('Users retrieved successfully', responseList));
    } catch (err) {
        return res.json(errorResponse(errorHandler.getErrorMessage(err)));
    }
};
const deleteUser = async (req, res) => {
    try {
        console.log('[Admin] deleteUser called for user id:', req.params.userId, 'by admin user id:', req.auth.userId);
        let user = await User.findByIdAndDelete(req.params.userId);
        if (!user) {
            return res.json(errorResponse("User not found"));
        }
        return res.json(successResponse('User deleted successfully'));
    } catch (err) {
        return res.json(errorResponse(errorHandler.getErrorMessage(err)));
    }
};
const banUser = async (req, res) => {
    try {
        console.log('[Admin] banUser called for user id:', req.params.userId, 'by admin user id:', req.auth.userId);
        let user = await User.findById(req.params.userId);
        if (!user) {
            return res.json(errorResponse("User not found"));
        }
        user.status = 'banned';
        await user.save();
        return res.json(successResponse('User banned successfully'));
    } catch (err) {
        return res.json(errorResponse(errorHandler.getErrorMessage(err)));
    }
};


export default {
    userList,
    deleteUser,
    banUser
};