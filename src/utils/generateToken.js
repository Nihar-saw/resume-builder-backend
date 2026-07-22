import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

/**
 * Generate Access Token
 */
export const generateAccessToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    env.JWT_SECRET,
    {
      expiresIn: "15m",
    }
  );
};

/**
 * Generate Refresh Token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign(
    {
      id: userId,
    },
    env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

/**
 * Send Refresh Token as HTTP-only Cookie
 */
export const sendRefreshToken = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};