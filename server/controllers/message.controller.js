// controllers/message.controller.js
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { successResponse, errorResponse } from '../helpers/apiResponse.js';

const sendMessage = async (req, res) => {
    console.log('sendMessage called', {
        body: { ...(req.body || {}) }
    });

    try {
        const userId = req.auth.userId;
        const { conversation_id, content } = req.body;

        const message = await Message.create({
            conversation_id,
            sender: userId,
            content,
            readBy: [userId]
        });
        console.log('Message created', { id: message._id, conversation_id, sender: userId });

        await Conversation.findByIdAndUpdate(conversation_id, {
            last_message: {
                message_id: message._id,
                sender_id: userId,
                content,
                timestamp: message.timestamp
            }
        });
        console.log('Conversation lastMessage updated', { conversation_id, last_message_id: message._id });

        const conv = await Conversation.findById(conversation_id);
        if (!conv) {
            console.warn('Conversation not found after update', { conversation_id });
            return res.status(404).json(errorResponse('Conversation not found'));
        }

        const unreadMap = conv.unread_count || new Map();

        conv.participants.forEach(p => {
            const uid = p.user_id.toString();
            if (uid === userId) return;
            unreadMap.set(uid, (unreadMap.get(uid) || 0) + 1);
        });

        conv.unread_count = unreadMap;
        await conv.save();
        console.log('Unread counts updated', { conversation_id, unread_count: conv.unread_count });

        res.json(successResponse("Message sent"));
    } catch (err) {
        console.error('sendMessage error', err.stack || err);
        res.json(errorResponse(err.message));
    }
};

const getMessages = async (req, res) => {
    console.log('getMessages called', { params: req.params });

    try {
        // filiter delete false
        const messages = await Message.find({
            conversation_id: req.params.conversation_id,
            deleted: false
        }).sort({ timestamp: 1 });

        console.log('Messages fetched', { conversation_id: req.params.conversation_id, count: messages.length });
        const responseList = messages.map(msg => ({
            message_id: msg._id,
            conversation_id: msg.conversation_id,
            sender: msg.sender,
            content: msg.content,
            reply_to: msg.reply_to,
            been_read: msg.read_by.length === 0 ? false : true,
            edited: msg.edited,
            timestamp: msg.timestamp
        }));
        res.json(successResponse("Messages retrieved", responseList));
    } catch (err) {
        console.error('getMessages error', err.stack || err);
        res.json(errorResponse(err.message));
    }
};

const markAsRead = async (req, res) => {
    console.log('markAsRead called', { params: req.params, body: req.body });

    try {
        const { message_id } = req.params;
        const userId = req.auth.userId;

        const message = await Message.findById(message_id);
        if (!message) {
            console.warn('Message not found for markAsRead', { message_id });
            return res.status(404).json(errorResponse("Message not found"));
        }

        // cant mark own message as read
        if (message.sender.toString() === userId) {
            console.log('markAsRead skipped for own message', { message_id, userId });
            return res.json(successResponse("Marked as read"));
        }

        if (!message.read_by.includes(userId)) {
            message.read_by.push(userId);
            await message.save();
            console.log('Marked message as read', { message_id, userId });
        } else {
            console.log('User already in read_by', { message_id, userId });
        }


        // Update unread count in Conversation
        const conversation = await Conversation.findById(message.conversation_id);
        if (conversation && conversation.unread_count) {
            const currentCount = conversation.unread_count.get(userId) || 0;
            if (currentCount > 0) {
                conversation.unread_count.set(userId, currentCount - 1);
                await conversation.save();
                console.log('Decremented unread count in conversation', { conversation_id: conversation._id, userId });
            }
        }

        res.json(successResponse("Marked as read"));
    } catch (err) {
        console.error('markAsRead error', err.stack || err);
        res.json(errorResponse(err.message));
    }
};
const editMessage = async (req, res) => {
    console.log('editMessage called', { params: req.params, body: req.body });

    try {
        const { content } = req.body;

        const message = await Message.findByIdAndUpdate(
            req.params.message_id,
            { content, edited: true },
            { new: true }
        );

        console.log('Message edited', { id: req.params.message_id, edited: !!message });
        res.json(successResponse("Message edited", message));
    } catch (err) {
        console.error('editMessage error', err.stack || err);
        res.json(errorResponse(err.message));
    }
};

const deleteMessage = async (req, res) => {
    console.log('deleteMessage called', { params: req.params });

    try {
        const message = await Message.findByIdAndUpdate(
            req.params.message_id,
            { deleted: true },
            { new: true }
        );

        console.log('Message deleted (soft)', { id: req.params.message_id, deleted: !!message });
        res.json(successResponse("Message deleted", message));
    } catch (err) {
        console.error('deleteMessage error', err.stack || err);
        res.json(errorResponse(err.message));
    }
};

export default {
    sendMessage,
    getMessages,
    markAsRead,
    editMessage,
    deleteMessage
};
