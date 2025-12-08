// controllers/conversation.controller.js
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { successResponse, errorResponse } from '../helpers/apiResponse.js';
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

const createConversation = async (req, res) => {
    try {
        const userId = req.auth.userId;
        const { type, participants, display_name } = req.body;
        console.info('createConversation called', {
            type,
            participantsCount: Array.isArray(participants) ? participants.length : 0,
            display_name
        });

        //add the creator as a participant if not already included
        const user = await User.findById(userId);
        if (!participants.includes(userId)) {
            participants.push(userId);
        }

        // dont allow duplicate conversation participants
        const existingConversation = await Conversation.findOne({
            type,
            'participants.user_id': { $all: participants }
        });
        if (existingConversation) {
            console.warn('createConversation failed - duplicate conversation', { conversation_id: existingConversation._id });
            return res.json(successResponse("A conversation with the same participants already exists", { conversation_id: existingConversation._id }));
        }

        const conversation = await Conversation.create({
            type,
            owner_id: userId,
            participants: participants.map(uid => ({ user_id: uid, joined_at: new Date() })),
            display_name: display_name
        });

        // Notify participants about the new friendship/conversation
        for (const participantId of participants) {
            if (participantId === userId) continue; // Skip notifying self
            const notification = new Notification({
                userId: participantId,
                title: 'New Conversation',
                message: `You have been added to a new conversation by user ${user.first_name}.`,
                type: 'info',
                isRead: false
            });
            await notification.save();
            console.info('Notification created for participant', { participantId, conversation_id: conversation._id });
        }

        console.info('createConversation success', { conversation_id: conversation._id });
        res.json(successResponse("Conversation created successfully", { conversation_id: conversation._id }));
    } catch (err) {
        console.error('createConversation error', err);
        res.json(errorResponse(err.message));
    }
};

const getUserConversations = async (req, res) => {
    try {
        const userId = req.auth.userId;
        console.info('getUserConversations called', { userId });

        const conversations = await Conversation.find({
            "participants.user_id": userId
        })
        .populate("participants.user_id", "first_name last_name profile_picture email")
        .sort({ "last_message.timestamp": -1 });

        console.info('getUserConversations success', { userId, count: conversations.length });

        const responseConversations = conversations.map(convObj => ({
            // REQUIRED by frontend
            conversation_id: convObj._id,

            // fully populated participants
            participants: convObj.participants.map(p => ({
                _id: p.user_id._id,
                first_name: p.user_id.first_name,
                last_name: p.user_id.last_name,
                profile_picture: p.user_id.profile_picture
            })),

            last_message: convObj.last_message ? convObj.last_message.content : null,
            last_message_timestamp: convObj.last_message ? convObj.last_message.timestamp : null,

            // allow ChatSidebar’s naming logic to kick in
            display_name: convObj.display_name || "",

            display_image: convObj.display_image || null,
            unread_count: convObj.unread_count ? convObj.unread_count.get(userId) || 0 : 0
        }));

        res.json(successResponse("User conversations retrieved", responseConversations));
    } catch (err) {
        console.error('getUserConversations error', err);
        res.json(errorResponse(err.message));
    }
};


const getConversationById = async (req, res) => {
    try {
        const id = req.params.conversation_id;
        console.info('getConversationById called', { id });

        const conversation = await Conversation.findById(id);

        if (!conversation) {
            console.warn('getConversationById not found', { id });
            return res.json(errorResponse("Conversation not found"));
        }

        console.info('getConversationById success', { id });
        res.json(successResponse("Conversation retrieved", conversation));
    } catch (err) {
        console.error('getConversationById error', err);
        res.json(errorResponse(err.message));
    }
};

const updateConversation = async (req, res) => {
    try {
        const id = req.params.conversation_id;
        console.info('updateConversation called', { id, updateFields: Object.keys(req.body) });

        const conversation = await Conversation.findById(id);
        if (!conversation) {
            console.warn('updateConversation not found', { id });
            return res.json(errorResponse("Conversation not found"));
        }
        // Prevent updating certain fields
        const allowedUpdates = ['display_name', 'display_image'];
        Object.keys(req.body).forEach(key => {
            if (!allowedUpdates.includes(key)) {
                delete req.body[key];
            }
        });
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                conversation[field] = req.body[field];
            }
        });
        await conversation.save();
        console.info('updateConversation success', { id });
        res.json(successResponse("Conversation updated successfully"));
    } catch (err) {
        console.error('updateConversation error', err);
        res.json(errorResponse(err.message));
    }
};

const deleteConversation = async (req, res) => {
    try {
        const id = req.params.conversation_id;
        console.info('deleteConversation called', { id });

        const deleted = await Conversation.findByIdAndDelete(id);
        if (!deleted) {
            console.warn('deleteConversation not found', { id });
            return res.json(errorResponse("Conversation not found"));
        }

        console.info('deleteConversation success', { id });
        res.json(successResponse("Conversation deleted successfully"));
    } catch (err) {
        console.error('deleteConversation error', err);
        res.json(errorResponse(err.message));
    }
};

export default {
    createConversation,
    getUserConversations,
    getConversationById,
    updateConversation,
    deleteConversation
};