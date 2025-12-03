import extend from "lodash/extend.js";
import errorHandler from "./error.controller.js";
import { successResponse, errorResponse } from '../helpers/apiResponse.js';
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

const createNotification = async (req, res) => {
    try {
        const { title, message, type } = req.body;
        const userId = req.auth.userId;
        console.log('[Notification] createNotification called', { userId, title, message, type });
        const notification = new Notification({
            userId,
            title,
            message,
            type: type || 'info',
            isRead: false
        });
        await notification.save();
        console.log('[Notification] Notification created', { id: notification._id, userId });
        return res.json(successResponse('Notification created successfully', { notification }));
    }
    catch (error) {
        console.error('[Notification] Error creating notification:', error);
        return res.status(500).json(errorResponse('An error occurred while creating the notification'));
    }
};

const getNotifications = async (req, res) => {
    try {
        const userId = req.auth.userId;
        console.log('[Notification] getNotifications called by user id:', userId);
        const notifications = await Notification.find({ userId: userId })
            .sort({ createdAt: -1 });

        const responseList = notifications.map(notif => ({
            notification_id: notif._id,
            title: notif.title,
            message: notif.message,
            type: notif.type,
            is_read: notif.isRead,
            created_at: notif.created_at,
            updated_at: notif.updated_at
        }));


        return res.json(successResponse('Notifications retrieved successfully', { notifications: responseList }));
    } catch (error) {
        console.error('[Notification] Error fetching notifications:', error);
        return res.status(500).json(errorResponse('An error occurred while fetching notifications'));
    }
};

const getNotificationById = async (req, res) => {
    try {
        const { notification_id } = req.params;
        const notification = await Notification.findById(notification_id);
        if (!notification) {
            return res.status(404).json(errorResponse('Notification not found'));
        }
        req.notification = notification;
        return res.json(successResponse('Notification retrieved successfully', { notification }));
    } catch (error) {
        console.error('[Notification] Error fetching notification by ID:', error);
        return res.status(500).json(errorResponse('An error occurred while fetching the notification'));
    }
};

const markAsRead = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { notification_id } = req.params;
        if (!notification_id) return res.status(400).json(errorResponse('Notification id is required'));

        const notification = await Notification.findOneAndUpdate(
            { _id: notification_id, userId: userId },
            { $set: { isRead: true } },
            { new: true }
        ).exec();

        if (!notification) return res.status(404).json(errorResponse('Notification not found'));

        return res.json(successResponse('Notification marked as read', { notification }));
    } catch (error) {
        console.error('[Notification] Error marking as read:', error);
        return res.status(500).json(errorResponse('An error occurred while updating the notification'));
    }
};

const markAllRead = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const result = await Notification.updateMany(
            { user: userId, read: false },
            { $set: { read: true } }
        ).exec();

        return res.json(successResponse('All notifications marked as read', { modifiedCount: result.nModified ?? result.modifiedCount }));
    } catch (error) {
        console.error('[Notification] Error marking all as read:', error);
        return res.status(500).json(errorResponse('An error occurred while updating notifications'));
    }
};

const deleteNotification = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { notification_id } = req.params;
        if (!notification_id) return res.status(400).json(errorResponse('Notification id is required'));

        const notification = await Notification.findOneAndDelete({ _id: notification_id, userId: userId }).exec();
        if (!notification) return res.status(404).json(errorResponse('Notification not found'));

        return res.json(successResponse('Notification deleted', { notification_id }));
    } catch (error) {
        console.error('[Notification] Error deleting notification:', error);
        return res.status(500).json(errorResponse('An error occurred while deleting the notification'));
    }
};

export default {
    createNotification,
    getNotifications,
    markAsRead,
    getNotificationById,
    markAllRead,
    deleteNotification
};