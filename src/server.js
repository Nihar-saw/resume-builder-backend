import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";
import { env } from "./config/env.js";

const PORT = env.PORT || process.env.PORT || 10000;

const startServer = async () => {
  try {
    console.log("Connecting to MongoDB...");

    await connectDB();

    console.log("MongoDB Connected Successfully.");

    app.listen(PORT, () => {
      console.log(`
====================================
 Resume Builder Backend Started
====================================
 Environment : ${env.NODE_ENV}
 Port        : ${PORT}
====================================
`);
    });
  } catch (error) {
    console.error("Server startup failed:");
    console.error(error);

    process.exit(1);
  }
};

startServer();