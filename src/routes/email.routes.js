import express from "express";

import {

sendOTPController,

verifyOTPController

} from "../controllers/email.controller.js";

const router=express.Router();

router.post("/send-otp",sendOTPController);

router.post("/verify-otp",verifyOTPController);

export default router;