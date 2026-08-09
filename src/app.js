import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

// Routes
import authRoutes from "./routes/auth.routes.js";
import resumeRoutes from "./routes/resume.routes.js";
import versionRoutes from "./routes/version.routes.js";
import atsRoutes from "./routes/ats.routes.js";
import parserRoutes from "./routes/parser.routes.js";
import aiRoutes from "./routes/ai.routes.js";
import jobMatchRoutes from "./routes/jobMatch.routes.js";
import pdfRoutes from "./routes/pdf.routes.js";
import templateRoutes from "./routes/template.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import docxRoutes from "./routes/docx.routes.js";
import emailRoutes from "./routes/email.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import portfolioRoutes from "./routes/portfolio.routes.js";

// Middleware
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// --- CORS ---
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, curl)
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith(".vercel.app") ||
      origin.endsWith(".onrender.com")
    ) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked: ${origin}`);
      callback(null, false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Enable CORS for all routes (automatically handles preflight OPTIONS requests in Express)
app.use(cors(corsOptions));

// --- Other middleware ---

app.use(compression());
app.use(morgan("dev"));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Resume Builder Backend is Running 🚀",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/version", versionRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/parser", parserRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/job-match", jobMatchRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/docx", docxRoutes);
app.use("/api/templates", templateRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/portfolio", portfolioRoutes);

// 404 Handler
app.use(notFound);

// Error Handler
app.use(errorHandler);

export default app;