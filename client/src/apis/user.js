import { api } from "./client";
import auth from "./auth-helper";

// GET ALL USERS
export const getUsers = async () => {
  return await api.get("/api/user/");
};

// GET SINGLE USER
export const getUser = async (id) => {
  return await api.get(`/api/user/${id}`);
};

// CREATE A USER
export const createUser = async (user) => {
  return await api.post("/api/user/", user);
};

// UPDATE USER
export const UPDATEUser = async (id, updates) => {
  return await api.put(`/api/user/${id}`, updates);
};

// DELETE USER
export const deleteUser = async (id) => {
  return await api.delete(`/api/user/${id}`);
};

// UPLOAD PROFILE PHOTO
export const uploadProfilePhoto = async (userId, file) => {
  const formData = new FormData();
  formData.append("profilePhoto", file);

  return await api.formPost(`/api/user/${userId}/upload-photo`, formData);
};

// UPLOAD GALLERY PHOTO
export const uploadGalleryPhoto = async (userId, file) => {
  const formData = new FormData();
  formData.append("galleryPhoto", file);

  return await api.formPost(`/api/user/${userId}/upload-gallery`, formData);
};

