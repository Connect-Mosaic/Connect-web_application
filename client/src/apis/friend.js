// src/apis/friend.js
import { api } from "./client";

// -----------------------------
// Unified naming convention
// -----------------------------

export const sendFriendRequestApi = (userId) =>
  api.post(`/api/friends/${userId}/send-request`);

export const cancelFriendRequestApi = (userId) =>
  api.post(`/api/friends/${userId}/cancel-request`);

export const acceptFriendRequestApi = (userId) =>
  api.post(`/api/friends/${userId}/accept-request`);

export const rejectFriendRequestApi = (userId) =>
  api.post(`/api/friends/${userId}/reject-request`);

export const unfriendApi = (userId) =>
  api.post(`/api/friends/${userId}/unfriend`);
