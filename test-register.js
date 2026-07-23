import "dotenv/config";
import mongoose from "mongoose";
import User from "./src/models/User.js";
import { generateAccessToken, generateRefreshToken } from "./src/utils/generateToken.js";

const test = async () => {
  try {
    console.log("Connecting to DB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected.");

    // Delete existing test user if any
    await User.deleteMany({ email: "[EMAIL_ADDRESS]" });

    console.log("Creating user...");
    const user = await User.create({
      firstName: "John",
      lastName: "Doe",
      email: "[EMAIL_ADDRESS]",
      password: "password123"
    });
    console.log("User created successfully:", user);

    console.log("Generating access token...");
    const token = generateAccessToken(user._id);
    console.log("Access token generated:", token);

    console.log("Generating refresh token...");
    const refresh = generateRefreshToken(user._id);
    console.log("Refresh token generated:", refresh);

    await mongoose.disconnect();
    console.log("Disconnected. Test succeeded!");
  } catch (error) {
    console.error("Test failed with error:", error);
    process.exit(1);
  }
};

test();
