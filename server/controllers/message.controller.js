// controllers/message.controller.js
import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import Notification from "../models/notification.model.js";
import { successResponse, errorResponse } from '../helpers/apiResponse.js';

const validateObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// --- SEND MESSAGE ---
const sendMessage = async (req, res) => {
    console.log('sendMessage called', { body: req.body });
    const userId = req.auth.userId;
    const { conversation_id } = req.params;
    const { content } = req.body;

    if (!validateObjectId(conversation_id)) {
        return res.status(400).json(errorResponse('Invalid conversation ID'));
    }

    if (!content || !content.trim()) {
        return res.status(400).json(errorResponse('Message content cannot be empty'));
    }

    try {
        const conv = await Conversation.findById(conversation_id);
        if (!conv) return res.status(404).json(errorResponse('Conversation not found'));

        const message = await Message.create({
            conversation_id,
            sender: userId,
            content,
            read_by: [userId]
        });

        // Update last_message
        conv.last_message = {
            message_id: message._id,
            sender_id: userId,
            content,
            timestamp: message.timestamp
        };

        // Update unread counts
        const unreadMap = conv.unread_count instanceof Map ? conv.unread_count : new Map();
        (conv.participants || []).forEach(p => {
            const uid = p.user_id?.toString();
            if (!uid || uid === userId) return;
            unreadMap.set(uid, (unreadMap.get(uid) || 0) + 1);
        });
        conv.unread_count = unreadMap;
        await conv.save();

        // Notify participants
        (conv.participants || []).forEach(async participant => {
            const participantId = participant.user_id?.toString();
            if (!participantId || participantId === userId) return;
            const notification = new Notification({
                userId: participantId,
                title: "New Message",
                message: `You have a new message in conversation ${conv.display_name || "Unnamed Conversation"}.`,
                type: "info",
                isRead: false
            });
            await notification.save();
        });

        const messageData = {
            login_user_id: userId,
            message_id: message._id,
            conversation_id: message.conversation_id,
            sender: message.sender,
            content: message.content,
            timestamp: message.timestamp,
            been_read: false,
            edited: message.edited || false
        };

        res.json(successResponse("Message sent", messageData));

    } catch (err) {
        console.error('sendMessage error', err.stack || err);
        res.status(500).json(errorResponse('Failed to send message'));
    }
};

// --- GET MESSAGES ---
const getMessages = async (req, res) => {
    const { conversation_id } = req.params;
    const userId = req.auth.userId;

    if (!validateObjectId(conversation_id)) {
        return res.status(400).json(errorResponse('Invalid conversation ID'));
    }

    try {
        const messages = await Message.find({ conversation_id, deleted: false }).sort({ timestamp: 1 });

        const responseList = messages.map(msg => ({
            login_user_id: userId,
            message_id: msg._id,
            conversation_id: msg.conversation_id,
            sender: msg.sender,
            content: msg.content,
            // my meesage has been read by others if not my message false
            been_read: msg.sender?.toString() === userId ? false : (Array.isArray(msg.read_by) && msg.read_by.length > 0),
            edited: msg.edited || false,
            timestamp: msg.timestamp
        }));
        // Mark unread messages as read
        const unreadMessages = messages.filter(
            msg => !Array.isArray(msg.read_by) || !msg.read_by.includes(userId) && msg.sender?.toString() !== userId
        );

        for (let msg of unreadMessages) {
            msg.read_by = Array.isArray(msg.read_by) ? msg.read_by : [];
            if (!msg.read_by.includes(userId)) {
                msg.read_by.push(userId);
                await msg.save();
            }
        }

        // Reset conversation unread count
        const conv = await Conversation.findById(conversation_id);
        if (conv) {
            const unreadMap = conv.unread_count instanceof Map ? conv.unread_count : new Map();
            if ((unreadMap.get(userId) || 0) > 0) {
                unreadMap.set(userId, 0);
                conv.unread_count = unreadMap;
                await conv.save();
            }
        }

        res.json(successResponse("Messages retrieved", responseList));

    } catch (err) {
        console.error('getMessages error', err.stack || err);
        res.status(500).json(errorResponse('Failed to fetch messages'));
    }
};

// --- MARK AS READ ---
const markAsRead = async (req, res) => {
    const { message_id } = req.params;
    const userId = req.auth.userId;

    if (!validateObjectId(message_id)) {
        return res.status(400).json(errorResponse('Invalid message ID'));
    }

    try {
        const message = await Message.findById(message_id);
        if (!message) return res.status(404).json(errorResponse("Message not found"));

        if (message.sender?.toString() !== userId) {
            message.read_by = Array.isArray(message.read_by) ? message.read_by : [];
            if (!message.read_by.includes(userId)) {
                message.read_by.push(userId);
                await message.save();
            }
        }

        // Update conversation unread count
        const conv = await Conversation.findById(message.conversation_id);
        if (conv) {
            const unreadMap = conv.unread_count instanceof Map ? conv.unread_count : new Map();
            const currentCount = unreadMap.get(userId) || 0;
            if (currentCount > 0) {
                unreadMap.set(userId, currentCount - 1);
                conv.unread_count = unreadMap;
                await conv.save();
            }
        }

        res.json(successResponse("Marked as read"));

    } catch (err) {
        console.error('markAsRead error', err.stack || err);
        res.status(500).json(errorResponse('Failed to mark message as read'));
    }
};

// --- EDIT MESSAGE ---
const editMessage = async (req, res) => {
    const { message_id } = req.params;
    const { content } = req.body;

    if (!validateObjectId(message_id)) {
        return res.status(400).json(errorResponse('Invalid message ID'));
    }

    if (!content || !content.trim()) {
        return res.status(400).json(errorResponse('Message content cannot be empty'));
    }

    try {
        const message = await Message.findByIdAndUpdate(
            message_id,
            { content, edited: true },
            { new: true }
        );

        if (!message) return res.status(404).json(errorResponse("Message not found"));

        res.json(successResponse("Message edited successfully", {
            message_id: message._id,
            content: message.content,
            edited: message.edited
        }));

    } catch (err) {
        console.error('editMessage error', err.stack || err);
        res.status(500).json(errorResponse('Failed to edit message'));
    }
};

// --- DELETE MESSAGE (soft delete) ---
const deleteMessage = async (req, res) => {
    const { message_id } = req.params;

    if (!validateObjectId(message_id)) {
        return res.status(400).json(errorResponse('Invalid message ID'));
    }

    try {
        const message = await Message.findByIdAndUpdate(
            message_id,
            { deleted: true },
            { new: true }
        );

        if (!message) return res.status(404).json(errorResponse("Message not found"));

        res.json(successResponse("Message deleted successfully"));

    } catch (err) {
        console.error('deleteMessage error', err.stack || err);
        res.status(500).json(errorResponse('Failed to delete message'));
    }
};

export default {
    sendMessage,
    getMessages,
    markAsRead,
    editMessage,
    deleteMessage
};
