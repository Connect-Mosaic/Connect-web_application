// src/apis/admin.js
import { api } from "./client";

// ADMIN — GET ALL USERS
export const getAdminUsers = async () => {
  return await api.get("/api/admin/users");
};

export const updateAdminUser = async (userId, updates) => {
  return await api.put(`/api/admin/users/${userId}`, updates);
};

// ADMIN — DELETE USER
export const deleteAdminUser = async (userId) => {
  return await api.delete(`/api/admin/users/${userId}`);
};

// ADMIN — BAN USER
export const banAdminUser = async (userId, reason, duration = "7d") => {
  return await api.post(`/api/admin/users/${userId}/ban`, {
    reason,
    duration,
  });
};

// ADMIN — DASHBOARD METRICS
export const getAdminDashboard = async () => {
  return await api.get("/api/admin/dashboard");
};
