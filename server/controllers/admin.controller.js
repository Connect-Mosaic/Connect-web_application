import User from "../models/user.model.js";
import Settings from "../models/settings.model.js";
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

const dashboard = async (req, res) => {
    try {
        console.log('[Admin] dashboard data called by admin user id:', req.auth.userId);
        // total users
        let totalUsers = await User.countDocuments({ role: { $ne: 'admin' } });
        // Active users today 
        let startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        let activeUsersToday = await User.countDocuments({ last_login_at: { $gte: Math.floor(startOfToday.getTime() / 1000) }, role: { $ne: 'admin' } });

        // new signups this week
        let startOfWeek = new Date();
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        startOfWeek.setHours(0, 0, 0, 0);
        let newSignupsThisWeek = await User.countDocuments({ createdAt: { $gte: Math.floor(startOfWeek.getTime() / 1000) }, role: { $ne: 'admin' } });

        // new signups this month
        let startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);
        let newSignupsThisMonth = await User.countDocuments({ createdAt: { $gte: Math.floor(startOfMonth.getTime() / 1000) }, role: { $ne: 'admin' } });

        res.json(successResponse('Dashboard data retrieved successfully', {
            total_users: totalUsers,
            active_users_today: activeUsersToday,
            new_signups_this_week: newSignupsThisWeek,
            new_signups_this_month: newSignupsThisMonth
        }));
    } catch (err) {
        return res.json(errorResponse(errorHandler.getErrorMessage(err)));
    }
};

const getSettings = async (req, res) => {
    try {
        console.log('[Admin] getSettings called by admin user id:', req.auth.userId);
        const settings = await Settings.getSettings();
        res.json(successResponse('Settings retrieved successfully', {
            siteName: settings.siteName,
            siteDescription: settings.siteDescription,
            allowRegistration: settings.allowRegistration,
            defaultUserRole: settings.defaultUserRole,
            maxUploadSize: settings.maxUploadSize,
            maintenanceMode: settings.maintenanceMode
        }));
    } catch (err) {
        return res.json(errorResponse(errorHandler.getErrorMessage(err)));
    }
};

const updateSettings = async (req, res) => {
    try {
        console.log('[Admin] updateSettings called by admin user id:', req.auth.userId);
        let settings = await Settings.getSettings();
        
        const allowedFields = ['siteName', 'siteDescription', 'allowRegistration', 'defaultUserRole', 'maxUploadSize', 'maintenanceMode'];
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                settings[field] = req.body[field];
            }
        });
        
        settings.updatedBy = req.auth.userId;
        
        await settings.save();
        
        res.json(successResponse('Settings updated successfully', {
            siteName: settings.siteName,
            siteDescription: settings.siteDescription,
            allowRegistration: settings.allowRegistration,
            defaultUserRole: settings.defaultUserRole,
            maxUploadSize: settings.maxUploadSize,
            maintenanceMode: settings.maintenanceMode
        }));
    } catch (err) {
        return res.json(errorResponse(errorHandler.getErrorMessage(err)));
    }
};

export default {
    userList,
    deleteUser,
    banUser,
    dashboard,
    getSettings,
    updateSettings
};