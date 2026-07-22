import express from "express";

import protect from "../middleware/auth.js";

import {

reviewController

} from "../controllers/review.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", reviewController);

export default router;