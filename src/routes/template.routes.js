import express from "express";

import protect from "../middleware/auth.js";

import {

changeTemplate

} from "../controllers/template.controller.js";

const router=express.Router();

router.use(protect);

router.patch("/:id",changeTemplate);

export default router;