import express from "express";
import {
  register,
  login,
  logout,
  getMe,
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

// Logout
router.post("/logout", protect, logout);

// Current User
router.get("/me", protect, getMe);

export default router;