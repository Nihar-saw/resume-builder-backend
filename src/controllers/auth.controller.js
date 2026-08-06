import User from "../models/User.js";
import { env } from "../config/env.js";
import { adminAuth } from "../config/firebaseAdmin.js";
import {
  generateAccessToken,
  generateRefreshToken,
  sendRefreshToken,
} from "../utils/generateToken.js";

/**
 * @desc Register User
 * @route POST /api/auth/register
 * @access Public
 */
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists.",
      });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      password,
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    sendRefreshToken(res, refreshToken);

    res.status(201).json({
      success: true,
      message: "Registration successful.",
      accessToken,
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

/**
 * @desc Login User
 * @route POST /api/auth/login
 * @access Public
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase(),
    }).select("+password +refreshToken");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    user.lastLogin = new Date();

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;

    await user.save();

    sendRefreshToken(res, refreshToken);

    res.json({
      success: true,
      message: "Login successful.",
      accessToken,
      user,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

/**
 * @desc Current Logged-in User
 * @route GET /api/auth/me
 * @access Private
 */
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

/**
 * @desc Logout
 * @route POST /api/auth/logout
 * @access Private
 */
export const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, {
      refreshToken: "",
    });

    res.clearCookie("refreshToken");

    res.json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

/**
 * @desc Refresh Access Token using httpOnly refresh cookie
 * @route POST /api/auth/refresh-token
 * @access Public (uses cookie, not Bearer token)
 */
export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies?.refreshToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No refresh token provided.",
      });
    }

    // Verify the refresh token
    let decoded;
    try {
      decoded = (await import("jsonwebtoken")).default.verify(token, env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token.",
      });
    }

    // Find the user and check that the stored refresh token matches
    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user || user.refreshToken !== token) {
      return res.status(401).json({
        success: false,
        message: "Refresh token is no longer valid.",
      });
    }

    // Issue a new access token
    const newAccessToken = generateAccessToken(user._id);

    res.json({
      success: true,
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

/**
 * @desc Update User Profile
 * @route PUT /api/auth/profile
 * @access Private
 */
export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, avatar } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (email !== undefined) user.email = email;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error.",
    });
  }
};

/**
 * @desc Firebase Social Login (Google / GitHub)
 * @route POST /api/auth/firebase
 * @access Public
 *
 * The frontend calls signInWithPopup() via the Firebase client SDK,
 * gets a Firebase ID token, and sends it here.
 * We verify it, find-or-create the user in MongoDB, and issue our own JWTs.
 */
export const firebaseLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Firebase ID token is required.",
      });
    }

    // Verify the Firebase ID token
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(idToken);
    } catch (err) {
      console.error("Firebase token verification failed:", err.message);
      return res.status(401).json({
        success: false,
        message: "Invalid or expired Firebase token.",
      });
    }

    const { uid, email, name, picture, firebase } = decodedToken;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email not available from provider. Please use an account with an email.",
      });
    }

    // Determine the auth provider from the Firebase sign-in method
    const signInProvider = firebase?.sign_in_provider || "google.com";
    let authProvider = "google";
    if (signInProvider.includes("github")) {
      authProvider = "github";
    }

    // Split display name into first/last (fallback to email prefix)
    const nameParts = (name || email.split("@")[0]).split(" ");
    const firstName = nameParts[0] || "User";
    const lastName = nameParts.slice(1).join(" ") || "";

    // Find existing user by email OR firebaseUid
    let user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { firebaseUid: uid }],
    }).select("+refreshToken");

    if (user) {
      // Update Firebase UID if not set (e.g. user originally registered with email/password)
      if (!user.firebaseUid) {
        user.firebaseUid = uid;
        user.authProvider = authProvider;
      }
      if (picture && !user.avatar) {
        user.avatar = picture;
      }
    } else {
      // Create new user
      user = await User.create({
        firstName,
        lastName,
        email: email.toLowerCase(),
        firebaseUid: uid,
        authProvider,
        avatar: picture || "",
        isVerified: true, // Firebase verifies email
      });
    }

    // Update last login
    user.lastLogin = new Date();

    // Issue our own JWT tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    sendRefreshToken(res, refreshToken);

    res.json({
      success: true,
      message: "Login successful.",
      accessToken,
      user,
    });
  } catch (error) {
    console.error("Firebase login error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

/**
 * @desc Set Password for Google / GitHub Users
 * @route POST /api/auth/set-password
 * @access Private (authenticated via JWT)
 */
export const setPassword = async (req, res) => {
  try {
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters.",
      });
    }

    // req.user is loaded by the protect middleware, but we fetch from DB to modify it
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    // Set the password — this will trigger hashing and setting isPasswordSet to true in userSchema.pre("save")
    user.password = password;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password configured successfully.",
      user,
    });
  } catch (error) {
    console.error("Set password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};