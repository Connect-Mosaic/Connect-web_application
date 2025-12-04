import { api } from "./client";

/* ============================================================
    EVENT LISTING
============================================================ */

// LIGHTWEIGHT EVENTS (used by MapPage)
export const getEvents = async () => {
    return await api.get("/api/events");
};

// FULL EVENTS with participants + organizer (used by EventPage)
export const getFullEvents = async () => {
    return await api.get("/api/events/full");
};

/* ============================================================
    SINGLE EVENT
============================================================ */

export const getEvent = async (id) => {
    return await api.get(`/api/events/${id}`);
};

/* ============================================================
    EVENT CRUD
============================================================ */

export const createEvent = async (event) => {
    return await api.post("/api/events", event);
};

export const updateEvent = async (id, updates) => {
    return await api.put(`/api/events/${id}`, updates);
};

export const deleteEvent = async (id) => {
    return await api.delete(`/api/events/${id}`);
};

/* ============================================================
    PARTICIPATION
============================================================ */

export const joinEvent = async (eventId) => {
    return await api.post(`/api/events/${eventId}/join`);
};

export const leaveEvent = async (eventId) => {
    return await api.post(`/api/events/${eventId}/leave`);
};
