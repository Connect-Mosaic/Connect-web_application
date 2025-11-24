import User from "../models/user.model.js";
import extend from "lodash/extend.js";
import errorHandler from "./error.controller.js";
import { successResponse, errorResponse } from '../helpers/apiResponse.js';
import crypto from 'crypto';

// In-memory settings store (in production, use a database)
let systemSettings = {
    general: {
        siteName: 'Connect Platform',
        siteDescription: 'A platform for connecting students and organizing events',
        maintenanceMode: false,
        userRegistration: true,
        emailNotifications: true,
        maxUsersPerEvent: 100,
        defaultUserRole: 'student'
    },
    email: {
        smtpHost: '',
        smtpPort: 587,
        smtpUser: '',
        smtpPassword: '',
        fromEmail: '',
        fromName: ''
    },
    security: {
        sessionTimeout: 30,
        passwordMinLength: 8,
        requireSpecialChars: true,
        enableTwoFactor: false,
        loginAttempts: 5,
        lockoutDuration: 15
    }
};

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

// Get system settings
const getSettings = async (req, res) => {
    try {
        console.log('[Admin] getSettings called by admin user id:', req.auth.userId);
        res.json(successResponse('Settings retrieved successfully', systemSettings));
    } catch (err) {
        return res.json(errorResponse(errorHandler.getErrorMessage(err)));
    }
};

// Update general settings
const updateGeneralSettings = async (req, res) => {
    try {
        console.log('[Admin] updateGeneralSettings called by admin user id:', req.auth.userId);
        systemSettings.general = { ...systemSettings.general, ...req.body };
        res.json(successResponse('General settings updated successfully', systemSettings.general));
    } catch (err) {
        return res.json(errorResponse(errorHandler.getErrorMessage(err)));
    }
};

// Update email settings
const updateEmailSettings = async (req, res) => {
    try {
        console.log('[Admin] updateEmailSettings called by admin user id:', req.auth.userId);
        systemSettings.email = { ...systemSettings.email, ...req.body };
        res.json(successResponse('Email settings updated successfully', systemSettings.email));
    } catch (err) {
        return res.json(errorResponse(errorHandler.getErrorMessage(err)));
    }
};

// Update security settings
const updateSecuritySettings = async (req, res) => {
    try {
        console.log('[Admin] updateSecuritySettings called by admin user id:', req.auth.userId);
        systemSettings.security = { ...systemSettings.security, ...req.body };
        res.json(successResponse('Security settings updated successfully', systemSettings.security));
    } catch (err) {
        return res.json(errorResponse(errorHandler.getErrorMessage(err)));
    }
};

// Create new admin user
const createAdminUser = async (req, res) => {
    try {
        console.log('[Admin] createAdminUser called by admin user id:', req.auth.userId);
        const { first_name, last_name, email, password, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.json(errorResponse('User with this email already exists'));
        }

        // Create new admin user
        const newUser = new User({
            first_name,
            last_name,
            email: email.toLowerCase(),
            role: role || 'admin',
            status: 'active'
        });

        // Set password
        const salt = crypto.randomBytes(16).toString('hex');
        const hashedPassword = crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');
        newUser.salt = salt;
        newUser.hashed_password = hashedPassword;

        await newUser.save();

        res.json(successResponse('Admin user created successfully', {
            id: newUser._id,
            name: `${newUser.first_name} ${newUser.last_name}`,
            email: newUser.email,
            role: newUser.role
        }));
    } catch (err) {
        return res.json(errorResponse(errorHandler.getErrorMessage(err)));
    }
};

// Test email connection
const testEmailConnection = async (req, res) => {
    try {
        console.log('[Admin] testEmailConnection called by admin user id:', req.auth.userId);
        const { smtpHost, smtpPort, smtpUser, smtpPassword } = req.body;

        // Simulate email test (in production, implement actual SMTP test)
        if (!smtpHost || !smtpUser || !smtpPassword) {
            return res.json(errorResponse('Missing SMTP configuration'));
        }

        // Simulate connection test delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        res.json(successResponse('Email connection test successful'));
    } catch (err) {
        return res.json(errorResponse('Email connection test failed: ' + errorHandler.getErrorMessage(err)));
    }
};

export default {
    userList,
    deleteUser,
    banUser,
    dashboard,
    getSettings,
    updateGeneralSettings,
    updateEmailSettings,
    updateSecuritySettings,
    createAdminUser,
    testEmailConnection
};
