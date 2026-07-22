import express from "express";

import protect from "../middleware/auth.js";

import upload from "../middleware/upload.js";

import {

parseResumeController

} from "../controllers/parser.controller.js";

const router = express.Router();

router.use(protect);

router.post(

"/",

upload.single("resume"),

parseResumeController

);

export default router;