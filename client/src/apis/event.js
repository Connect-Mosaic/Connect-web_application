import {api} from "./client";

//GET EVENTS
export const getEvents = async() => {
    return await api.get("/api/events/");
};

//GET SINGLE EVENT
export const getEvent = async(id) => {
    return await api.get(`/api/events/${id}`);
};

//CREATE EVENT
export const createEvent = async(event) => {
    return await api.post('/api/events', event);
};

//UPDATE EVENT
export const updateEvent = async(id,updates) => {
    return await api.put(`/api/events/${id}`,updates);
};

//DELETE EVENT
export const deleteEvent = async(id) => {
    return await api.delete(`/api/events/${id}`);
};