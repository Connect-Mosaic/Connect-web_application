import { api } from "./client";

//Get USER CONVERSATIONS
export const getUserConversations = async () => {
    return await api.get("/api/conversations/");
};

// Create NEW CONVERSATION
export const createConversation = async (conversation) => {
    return await api.post("/api/conversations/", conversation);
};

// UPDATE CONVERSATION
export const updateConversation = async (conversation_id, updates) => {
    return await api.put(`/api/conversations/${conversation_id}`, updates);
};

// DELETE CONVERSATION
export const deleteConversation = async (conversation_id) => {
    return await api.delete(`/api/conversations/${conversation_id}`);
};
// GET MESSAGES IN A CONVERSATION
export const getMessages = async (conversation_id) => {
    return await api.get(`/api/conversations/${conversation_id}/messages`);
};
// SEND MESSAGE IN A CONVERSATION
export const sendMessage = async (conversation_id, message) => {
    return await api.post(`/api/conversations/${conversation_id}/messages`, message);
};

//EDIT MESSAGE IN A CONVERSATION
export const editMessage = async (conversation_id, message_id, content) => {
    return await api.put(`/api/conversations/${conversation_id}/messages/${message_id}`, { content });
};

//DELETE MESSAGE IN A CONVERSATION
export const deleteMessage = async (conversation_id, message_id) => {
    return await api.delete(`/api/conversations/${conversation_id}/messages/${message_id}`);
};