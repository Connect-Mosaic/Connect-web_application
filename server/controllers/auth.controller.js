import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import config from "../configs/config.js";
import { successResponse, errorResponse } from "../helpers/apiResponse.js";

/* ======================================================
   LOGIN
====================================================== */
const login = async (req, res) => {
  try {
    const { email, password } = req.body.user || {};
    const rememberMe = req.body.rememberMe || false;

    if (!email || !password) {
      return res.json(errorResponse("Email and password are required"));
    }

    const user = await User.findOne({ email });
    if (!user) return res.json(errorResponse("User not found"));
    if (!user.authenticate(password))
      return res.json(errorResponse("Email and password don't match."));

    user.last_login_at = Math.floor(Date.now() / 1000);
    await user.save();

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      config.jwtSecret,
      { expiresIn: rememberMe ? "7d" : "24h" }
    );

    return res.json(
      successResponse("Login successful", {
        token,
        user: {
          id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          university: user.university,
          program: user.program,
          interests: user.interests,
          bio: user.bio,
          profile_picture: user.profile_picture,
          photos: user.photos,
          role: user.role,
          createdAt: user.createdAt,
        },
      })
    );
  } catch (err) {
    console.error("[Auth] Login error:", err);
    return res.json(errorResponse("Could not sign in"));
  }
};

/* ======================================================
   LOGOUT
====================================================== */
const logout = (req, res) => {
  return res.json(successResponse("Logout successful", {}));
};

/* ======================================================
   REGISTER
====================================================== */
const register = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      university,
      program,
      interests,
      bio,
      location,
      profile_picture,
    } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.json(errorResponse("User already exists with this email"));

    const user = new User({
      first_name,
      last_name,
      email,
      password,
      university,
      program,
      interests,
      bio,
      location,
      profile_picture,
    });

    await user.save();

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      },
      config.jwtSecret,
      { expiresIn: "24h" }
    );

    return res.json(
      successResponse("User registered successfully", {
        token,
        user: {
          id: user._id,
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          university: user.university,
          program: user.program,
          interests: user.interests,
          bio: user.bio,
          profile_picture: user.profile_picture,
          photos: user.photos,
          role: user.role,
          createdAt: user.createdAt,
        },
      })
    );
  } catch (err) {
    console.error("[Auth] Registration error:", err);
    return res.json(errorResponse("Server error during registration"));
  }
};

/* ======================================================
   REQUIRE SIGNIN — FIXED VERSION
====================================================== */
const requireSignin = expressjwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
  requestProperty: "auth", // decoded token stored in req.auth
  getToken: (req) => {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    }
    return null;
  },
});

/* ======================================================
   AUTH CHECK
====================================================== */
const hasAuthorization = (req, res, next) => {
  if (!req.profile || !req.auth)
    return res.json(errorResponse("User is not authorized"));

  const isAuthorized =
    req.profile._id.toString() === req.auth.userId.toString();

  if (!isAuthorized)
    return res.json(errorResponse("User is not authorized"));

  next();
};

/* ======================================================
   ADMIN CHECK
====================================================== */
const requireAdminAccess = (req, res, next) => {
  if (req.auth && req.auth.role === "admin") return next();
  return res.json(errorResponse("User is not authorized for admin action"));
};

export default {
  login,
  logout,
  register,
  requireSignin,
  hasAuthorization,
  requireAdminAccess,
};
