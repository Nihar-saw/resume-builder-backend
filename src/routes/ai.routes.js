import express from "express";

import protect from "../middleware/auth.js";

import {
  improveSummaryController,
  improveExperienceController,
  coverLetterController,
  skillsController,
  interviewController,
} from "../controllers/ai.controller.js";

const router = express.Router();

/*
| All AI routes require authentication
*/

router.use(protect);

/*
| Resume AI

*/

// Improve professional summary
router.post("/summary", improveSummaryController);

// Improve experience bullet
router.post("/experience", improveExperienceController);

// Suggest missing skills
router.post("/skills", skillsController);

/*
| Cover Letter
*/

router.post("/cover-letter", coverLetterController);

/*
| Interview Preparation
*/

router.post("/interview", interviewController);

export default router;