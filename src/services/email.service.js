import nodemailer from "nodemailer";

const transporter=nodemailer.createTransport({

service:"gmail",

auth:{

user:process.env.EMAIL,

pass:process.env.EMAIL_PASSWORD

}

});

export const sendOTP=async(email,otp)=>{

await transporter.sendMail({

from:process.env.EMAIL,

to:email,

subject:"Resume Builder OTP",

html:`

<h2>Your OTP</h2>

<h1>${otp}</h1>

<p>This OTP expires in 10 minutes.</p>

`

});

};