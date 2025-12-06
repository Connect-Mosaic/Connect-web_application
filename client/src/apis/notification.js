// src/apis/notification.js
import { api } from "./client";

// Get all notifications for a user
export const getNotifications = () => {
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  console.log("JWT FOUND:", jwt);

  return api.get("/api/notifications", {
    headers: {
      Authorization: `Bearer ${jwt?.token}`,
    },
  });
};



// Create a new notification  🔥 IMPORTANT CHANGE HERE
export const createNotification = (payload) => {
  // was: "/api/notifications/create"
  return api.post("/api/notifications", payload);
};

// (Optional helpers, if you have these routes)
export const markNotificationRead = (id) => {
  const jwt = JSON.parse(localStorage.getItem("jwt"));
  return api.put(`/api/notifications/${id}/read`, {}, {
    headers: { Authorization: `Bearer ${jwt?.token}` },
  });
};


export const deleteNotification = (id) => {
  return api.delete(`/api/notifications/${id}`);
};
