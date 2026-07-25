import { nanoid } from "nanoid";

import Portfolio from "../models/Portfolio.js";

import { generateQRCode } from "../services/qr.service.js";

export const createPortfolio = async(req,res)=>{
  try {
    const {resumeId, theme = "auto"}=req.body;
    if (!resumeId) {
      return res.status(400).json({
        success: false,
        message: "Resume ID is required."
      });
    }

    const slug=nanoid(8);
    const url=`${process.env.CLIENT_URL || "http://localhost:5173"}/r/${slug}`;
    const qr=await generateQRCode(url);

    // Upsert or find-existing to prevent duplicate index exceptions
    let portfolio = await Portfolio.findOne({ resume: resumeId });
    if (portfolio) {
      portfolio.qrCode = qr;
      if (theme) portfolio.theme = theme;
      await portfolio.save();
    } else {
      portfolio = await Portfolio.create({
        user: req.user._id,
        resume: resumeId,
        slug,
        qrCode: qr,
        theme,
        isPublic: true
      });
    }

    res.json({
      success:true,
      portfolio
    });
  } catch (error) {
    console.error("Create Portfolio Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error."
    });
  }
};

export const getPublicResume = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({
      slug: req.params.slug,
      isPublic: true,
    })
      .populate("resume")
      .populate("user", "avatar");

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
      user: portfolio.user,
      qrCode: portfolio.qrCode,
      theme: portfolio.theme || "auto",
      views: portfolio.views,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};