import express from "express";
import protect from "../middleware/auth.js";
import { dashboardController } from "../controllers/dashboard.controller.js";

const router = express.Router();

router.use(protect);

router.get("/", dashboardController);

export default router;