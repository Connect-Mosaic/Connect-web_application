import User from "../models/user.model.js";
import errorHandler from "./error.controller.js";
import { successResponse, errorResponse } from "../helpers/apiResponse.js";

/* ============================================================
   CREATE USER
============================================================ */
const create = async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    return res.json(successResponse("User created successfully", user));
  } catch (err) {
    return res.json(errorResponse(errorHandler.getErrorMessage(err)));
  }
};

/* ============================================================
   LIST USERS
============================================================ */
const list = async (req, res) => {
  try {
    const users = await User.find().select(
      "first_name last_name email createdAt updatedAt"
    );
    return res.json(successResponse("Users retrieved successfully", users));
  } catch (err) {
    return res.json(errorResponse(errorHandler.getErrorMessage(err)));
  }
};

/* ============================================================
   PARAM: LOAD USER BY ID
============================================================ */
const userByID = async (req, res, next, id) => {
  try {
    const user = await User.findById(id);

    if (!user) return res.json(errorResponse("User not found"));

    req.profile = user;
    next();
  } catch (err) {
    return res.json(errorResponse("Could not retrieve user"));
  }
};

/* ============================================================
   READ USER
============================================================ */
const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

/* ============================================================
   UPDATE USER
============================================================ */
const update = async (req, res) => {
  try {
    const allowed = [
      "first_name",
      "last_name",
      "email",
      "password",
      "interests",
      "university",
      "role",
      "program",
      "profile_picture",
      "bio",
      "location"
    ];

    const updates = Object.keys(req.body);
    const isValid = updates.every((key) => allowed.includes(key));

    if (!isValid)
      return res.json(errorResponse("Invalid update fields"));

    if (req.body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(req.body.email))
        return res.json(errorResponse("Invalid email address"));
    }

    if (req.body.password && req.body.password.length < 6)
      return res.json(errorResponse("Password must be at least 6 characters"));

    const user = req.profile;

    updates.forEach((key) => (user[key] = req.body[key]));
    user.updatedAt = Math.floor(Date.now() / 1000);
    await user.save();

    user.hashed_password = undefined;
    user.salt = undefined;

    return res.json(
      successResponse("User updated successfully", {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        university: user.university,
        program: user.program,
        role: user.role,
        interests: user.interests,
        bio: user.bio,
        profile_picture: user.profile_picture,
        photos: user.photos
      })
    );
  } catch (err) {
    return res.json(errorResponse(errorHandler.getErrorMessage(err)));
  }
};

/* ============================================================
   REMOVE USER
============================================================ */
const remove = async (req, res) => {
  try {
    const deletedUser = await req.profile.deleteOne();
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;

    return res.json(
      successResponse("User deleted successfully", deletedUser)
    );
  } catch (err) {
    return res.json(errorResponse(errorHandler.getErrorMessage(err)));
  }
};

/* ============================================================
   UPLOAD PROFILE PHOTO
============================================================ */
const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No file uploaded" });

    const filePath = `/uploads/profile/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { profile_picture: filePath },
      { new: true }
    ).select("-hashed_password -salt");

    if (!updatedUser)
      return res.status(404).json({ error: "User not found" });

    return res.json(
      successResponse("Profile updated", updatedUser)
    );
  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({ error: "Server error uploading photo" });
  }
};

/* ============================================================
   UPLOAD GALLERY PHOTO
============================================================ */
const uploadGalleryPhoto = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No file uploaded" });

    const filePath = `/uploads/gallery/${req.file.filename}`;

    const user = await User.findById(req.params.userId);
    user.photos.push(filePath);
    await user.save();

    return res.json(
      successResponse("Photo added to gallery", {
        photoUrl: filePath,
        photos: user.photos
      })
    );
  } catch (err) {
    console.error("Gallery upload error:", err);
    return res.status(500).json({
      error: "Failed to upload gallery photo"
    });
  }
};

/* ============================================================
   EXPORT ONLY USER-RELATED FUNCTIONS
============================================================ */
export default {
  create,
  list,
  userByID,
  read,
  update,
  remove,
  uploadProfilePhoto,
  uploadGalleryPhoto
};
