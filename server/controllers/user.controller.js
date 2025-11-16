import User from "../models/user.model.js";
import extend from "lodash/extend.js";
import errorHandler from "./error.controller.js";

/* --------------------------
   CREATE USER
-------------------------- */
const create = async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    return res.status(200).json({
      message: "Successfully signed up!",
    });
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

/* --------------------------
   LIST USERS
-------------------------- */
const list = async (req, res) => {
  try {
    let users = await User.find().select("first_name last_name email role");
    res.json(users);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

/* --------------------------
   PARAM: LOAD USER BY ID
-------------------------- */
const userByID = async (req, res, next, id) => {
  try {
    let user = await User.findById(id);
    if (!user)
      return res.status(400).json({
        error: "User not found",
      });
    req.profile = user;
    next();
  } catch (err) {
    return res.status(400).json({
      error: "Could not retrieve user",
    });
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
    let user = req.profile;
    user = extend(user, req.body);
    user.updatedAt = Date.now();
    await user.save();

    user.hashed_password = undefined;
    user.salt = undefined;

    res.json(user);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
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

    res.json(deletedUser);
  } catch (err) {
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
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
