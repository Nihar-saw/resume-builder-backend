import ATSReport from "../models/ATSReport.js";
import catchAsync from "../utils/catchAsync.js";
import { analyzeResume } from "../services/ats.service.js";

export const analyzeATS = catchAsync(async (req, res) => {
  const { resumeId, jobDescription, jobTitle } = req.body;

  const report = await analyzeResume(
    req.user._id,
    resumeId,
    jobDescription,
    jobTitle
  );

  res.status(200).json({
    success: true,
    message: "ATS analysis completed.",
    report,
  });
});

export const getATSReport = catchAsync(async (req, res) => {
  const report = await ATSReport.findOne({
    resume: req.params.resumeId,
    user: req.user._id,
  });

  if (!report) {
    return res.status(404).json({
      success: false,
      message: "ATS report not found.",
    });
  }

  res.json({
    success: true,
    report,
  });
});

export const deleteATSReport = catchAsync(async (req, res) => {
  await ATSReport.findOneAndDelete({
    resume: req.params.resumeId,
    user: req.user._id,
  });

  res.json({
    success: true,
    message: "ATS report deleted successfully.",
  });
});