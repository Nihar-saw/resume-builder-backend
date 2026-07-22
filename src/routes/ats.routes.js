import express from "express";
import protect from "../middleware/auth.js";

import {
  analyzeATS,
  getATSReport,
  deleteATSReport,
} from "../controllers/ats.controller.js";

const router = express.Router();

router.use(protect);

// Analyze Resume
router.post("/analyze", analyzeATS);

// Get Report
router.get("/:resumeId", getATSReport);

// Delete Report
router.delete("/:resumeId", deleteATSReport);

export default router;