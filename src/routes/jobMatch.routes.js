import express from "express";

import protect from "../middleware/auth.js";

import {

analyzeJobMatchController

} from "../controllers/jobMatch.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", analyzeJobMatchController);

export default router;