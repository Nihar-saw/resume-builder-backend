import express from "express";

import protect from "../middleware/auth.js";

import {
  downloadResumeDocx,
} from "../controllers/docx.controller.js";

const router = express.Router();

router.use(protect);

router.get("/:id", downloadResumeDocx);

export default router;