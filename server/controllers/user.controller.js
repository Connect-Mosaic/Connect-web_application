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
const list = async (req, res) => {
  try {
    let users = await User.find().select("name email updated created");
    res.json(successResponse('Users retrieved successfully', users));
  } catch (err) {
    return res.json(errorResponse(errorHandler.getErrorMessage(err)));
  }
};
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
const read = (req, res) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.json(req.profile);
};
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
export default { create, userByID, read, list, remove, update };
