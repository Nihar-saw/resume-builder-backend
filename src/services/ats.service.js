import Resume from "../models/Resume.js";
import ATSReport from "../models/ATSReport.js";
import { calculateATS } from "../utils/atsCalculator.js";
import AppError from "../utils/AppError.js";

export const analyzeResume = async (
  userId,
  resumeId,
  jobDescription,
  jobTitle = ""
) => {
  const resume = await Resume.findOne({
    _id: resumeId,
    user: userId,
  });

  if (!resume) {
    throw new AppError("Resume not found", 404);
  }

  const result = calculateATS(resume, jobDescription);

  // Save score in Resume
  resume.atsScore = result.overallScore;
  await resume.save();

  // Upsert ATS report
  const report = await ATSReport.findOneAndUpdate(
    {
      user: userId,
      resume: resumeId,
    },
    {
      user: userId,
      resume: resumeId,
      analyzedJobTitle: jobTitle,
      overallScore: result.overallScore,
      keywordScore: result.keywordScore,
      formattingScore: result.formattingScore,
      contentScore: result.contentScore,
      matchedKeywords: result.matchedKeywords,
      missingKeywords: result.missingKeywords,
      suggestions: result.suggestions,
    },
    {
      upsert: true,
      new: true,
    }
  );

  return report;
};