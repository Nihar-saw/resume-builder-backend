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
    const portfolio = await Portfolio.findOne({
      slug: req.params.slug,
      isPublic: true,
    }).populate("resume");

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Resume not found.",
      });
    }

    portfolio.views++;
    await portfolio.save();

    res.json({
      success: true,
      resume: portfolio.resume,
      qrCode: portfolio.qrCode,
      views: portfolio.views,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};