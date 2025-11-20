import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
import config from "../configs/config.js";
import { successResponse, errorResponse } from '../helpers/apiResponse.js';
const login = async (req, res) => {
  try {
    const { email, password } = req.body.user || {};
    const rememberMe = req.body.rememberMe || false;

    console.log('[Auth] login input', { email, rememberMe }); // do NOT log passwords

    // Validate input
    if (!email || !password) {
      console.log('[Auth] login failed - missing email or password');
      return res.json(errorResponse('Email and password are required'));
    }

    // Find user
    console.log('[Auth] Looking up user for email:', email);
    let user = await User.findOne({ email: email });
    if (!user) {
      console.log('[Auth] login failed - user not found for email:', email);
      return res.json(errorResponse("User not found"));
    }
    console.log('[Auth] user found with id:', user._id);

    // Check password
    if (!user.authenticate(password)) {
      console.log('[Auth] login failed - authentication failed for user id:', user._id);
      return res.json(errorResponse("Email and password don't match."));
    }
    console.log('[Auth] authentication successful for user id:', user._id);

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      config.jwtSecret,
      { expiresIn: rememberMe ? '7d' : '24h' }
    );
    console.log('[Auth] JWT token generated for user id:', user._id, 'expiresIn:', rememberMe ? '7d' : '24h');

    return res.json(successResponse('Login successful', {
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
      }
    }));

  } catch (err) {
    console.error('[Auth] Login error:', err && err.stack ? err.stack : err);
    return res.json(errorResponse("Could not sign in"));
  }
};

const logout = (req, res) => {
  // Since we're using JWT, logout is handled on frontend by removing token
  return res.json(successResponse('Logout successful', {
    message: "Logout successful",
  }));
};

const register = async (req, res) => {
  const { first_name, last_name, email, password, university, program, interests, bio, location, profile_picture } = req.body;
  console.log('[Auth] register called', {
    first_name,
    last_name,
    email,
    university,
    program,
    interests,
    location,
    profile_picture
  }); // Do NOT log passwords

  try {
    // Check if user already exists
    console.log('[Auth] Checking if user exists for email:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('[Auth] Registration failed - user already exists:', email);
      return res.json(errorResponse('User already exists with this email'));
    }

    // Create new user
    console.log('[Auth] Creating new user for email:', email);
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
      profile_picture
    });


    console.log('[Auth] Saving new user to DB for email:', email);
    await user.save();
    console.log('[Auth] User saved with id:', user._id);

    // Generate token for auto-login after registration
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role
      },
      config.jwtSecret,
      { expiresIn: '24h' }
    );
    console.log('[Auth] JWT token generated for user id:', user._id);

    return res.json(successResponse('User registered successfully', {
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
      }
    }));

    // return res.json("User registered successfully");
  } catch (err) {
    console.error('[Auth] Registration error:', err && err.stack ? err.stack : err);
    return res.json(errorResponse("Server error during registration"));
  }
};

const requireSignin = expressjwt({
  secret: config.jwtSecret,
  algorithms: ["HS256"],
  userProperty: "auth",
});

const hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth.userId;
  if (!authorized) {
    return res.json(errorResponse('User is not authorized to perform this action'));
  }
  next();
};

const requireAdminAccess = (req, res, next) => {
  if (req.auth && req.auth.role === "admin") {
    next();
  } else {
    return res.json(errorResponse('User is not authorized to perform this action'));
  }
};

export default { login, logout, requireSignin, hasAuthorization, requireAdminAccess, register };