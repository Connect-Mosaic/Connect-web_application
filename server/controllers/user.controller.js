import User from "../models/user.model.js";
import extend from "lodash/extend.js";
import errorHandler from "./error.controller.js";
import { successResponse, errorResponse } from '../helpers/apiResponse.js';

const create = async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    return res.json(successResponse('User created successfully', user));
  } catch (err) {
    return res.json(errorResponse(errorHandler.getErrorMessage(err)));
  }
};

/* --------------------------
   LIST USERS
-------------------------- */
const list = async (req, res) => {
  try {
    let users = await User.find().select("name email updated created");
    res.json(successResponse('Users retrieved successfully', users));
  } catch (err) {
    return res.json(errorResponse(errorHandler.getErrorMessage(err)));
  }
};

/* --------------------------
   PARAM: LOAD USER BY ID
-------------------------- */
const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id);
    if (!user) {
      return res.json(errorResponse("User not found"));
    }
    req.profile = user;
    next();
  } catch (err) {
    return res.json(errorResponse("Could not retrieve user"));
  }
};

/* --------------------------
   READ USER (hide password fields)
-------------------------- */
const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};

/* --------------------------
   UPDATE USER
-------------------------- */
const update = async (req, res) => {
  try {
    console.log('[User] update called for user id:', req.profile._id);
    const allowed = ['first_name', 'last_name', 'email', 'password', 'interests', 'university', 'role', 'program', 'profile_picture_url', 'bio', 'location']; //wait for more fields
    const updates = Object.keys(req.body);
    const isValid = updates.every((key) => allowed.includes(key));
    if (!isValid) {
      return res.json(errorResponse('Invalid update fields'));
    }

    if (req.body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(req.body.email)) {
        return res.json(errorResponse('Invalid email address'));
      }
    }

    if (req.body.password && req.body.password.length < 6) {
      return res.json(errorResponse('Password must be at least 6 characters'));
    }

    let user = req.profile;
    updates.forEach((key) => (user[key] = req.body[key]));
    user.updated = Date.now();
    await user.save();

    user.hashed_password = undefined;
    user.salt = undefined;
    res.json(successResponse('User updated successfully', user));
  } catch (err) {
    return res.json(errorResponse(errorHandler.getErrorMessage(err)));
  }
};

/* --------------------------
   REMOVE USER
-------------------------- */
const remove = async (req, res) => {
  try {
    let user = req.profile;
    let deletedUser = await user.deleteOne();
    
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;
    res.json(successResponse('User deleted successfully', deletedUser));
  } catch (err) {
    return res.json(errorResponse(errorHandler.getErrorMessage(err)));
  }
};

/* --------------------------
   ⭐ NEW: UPLOAD PROFILE PHOTO
-------------------------- */
const uploadProfilePhoto = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: "No file uploaded" });

    const filePath = `/uploads/profile/${req.file.filename}`;

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.params.userId,
      { profile_picture: filePath },
      { new: true }
    );

    updatedUser.hashed_password = undefined;
    updatedUser.salt = undefined;

    return res.json({
      message: "Profile photo updated",
      photoUrl: filePath,
      user: updatedUser,
    });

  } catch (err) {
    console.error("Upload error:", err);
    return res.status(500).json({
      error: "Server error uploading photo",
    });
  }
};

// Upload photo
const uploadGalleryPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = "/uploads/gallery/" + req.file.filename;

    const user = await User.findById(req.params.userId);

    user.photos.push(filePath);
    await user.save();

    res.json({
      message: "Photo added to gallery",
      photoUrl: filePath,
      photos: user.photos
    });
  } catch (err) {
    console.error("Gallery upload error:", err);
    res.status(500).json({ error: "Failed to upload gallery photo" });
  }
};


export default { create, userByID, read, list, remove, update, uploadProfilePhoto, uploadGalleryPhoto };
