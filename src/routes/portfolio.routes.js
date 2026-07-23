import express from "express";

import protect from "../middleware/auth.js";

import {

createPortfolio,

getPublicResume

} from "../controllers/portfolio.controller.js";

const router=express.Router();

router.post("/",protect,createPortfolio);

router.get("/:slug",getPublicResume);

export default router;