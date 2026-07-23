import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
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


const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(helmet());
app.use(compression());
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Resume Builder Backend API",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/version", versionRoutes);
app.use("/api/ats", atsRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/parser", parserRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/job-match", jobMatchRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/docx", docxRoutes);
app.use("/api/templates", templateRoutes);


app.use(notFound);

app.use(errorHandler);

// 404 Route
app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export default app;