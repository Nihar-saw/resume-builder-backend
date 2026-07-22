import express from "express";

import protect from "../middleware/auth.js";

import {
  createResume,
  getAllResumes,
  getResumeById,
  updateResume,
  deleteResume,
  duplicateResume,
} from "../controllers/resume.controller.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .post(createResume)
  .get(getAllResumes);

router.route("/:id")
  .get(getResumeById)
  .put(updateResume)
  .delete(deleteResume);

router.post("/:id/duplicate", duplicateResume);

export default router;