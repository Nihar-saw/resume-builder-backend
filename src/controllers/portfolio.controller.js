import { nanoid } from "nanoid";

import Portfolio from "../models/Portfolio.js";

import { generateQRCode } from "../services/qr.service.js";

export const createPortfolio = async(req,res)=>{

const {resumeId}=req.body;

const slug=nanoid(8);

const url=`${process.env.CLIENT_URL}/r/${slug}`;

const qr=await generateQRCode(url);

const portfolio=await Portfolio.create({

user:req.user._id,

resume:resumeId,

slug,

qrCode:qr,

isPublic:true

});

res.json({

success:true,

portfolio

});

};

export const getPublicResume = async (req, res) => {
  try {
    // Fetch the public portfolio/resume by slug or id
    res.status(200).json({
      success: true,
      message: "Public resume endpoint",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};