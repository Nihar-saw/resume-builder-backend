import express from "express";
import {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  refreshAccessToken,
  firebaseLogin,
  setPassword,
} from "../controllers/auth.controller.js";

import protect from "../middleware/auth.js";

const router = express.Router();

/*
    Authentication Routes
*/

// Register
router.post("/register", register);

// Login
router.post("/login", login);

// Firebase Social Login (Google / GitHub)
router.post("/firebase", firebaseLogin);

// Refresh Access Token (public — uses httpOnly cookie)
router.post("/refresh-token", refreshAccessToken);

// Logout
router.post("/logout", protect, logout);

// Current User
router.get("/me", protect, getMe);

// Update Profile
router.put("/profile", protect, updateProfile);

// Configure Password for Google / GitHub Users
router.post("/set-password", protect, setPassword);

export default router;