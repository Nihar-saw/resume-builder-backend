import OTP from "../models/OTP.js";

import otpGenerator from "otp-generator";

import {sendOTP} from "../services/email.service.js";

export const sendOTPController=async(req,res)=>{

const {email}=req.body;

const otp=otpGenerator.generate(6,{

upperCaseAlphabets:false,

specialChars:false,

lowerCaseAlphabets:false

});

await OTP.create({

email,

otp,

expiresAt:new Date(

Date.now()+10*60*1000

)

});

await sendOTP(email,otp);

res.json({

success:true,

message:"OTP Sent"

});

};