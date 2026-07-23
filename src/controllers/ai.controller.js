import catchAsync from "../utils/catchAsync.js";

import {
  improveSummary,
  improveExperience,
  createCoverLetter,
  suggestSkills,
  interviewQuestions,
  generateResumeFromPrompt,
} from "../services/ai.service.js";

/**
 * @desc Improve Professional Summary
 * @route POST /api/ai/summary
 * @access Private
 */
export const improveSummaryController = catchAsync(async (req, res) => {
  const { summary, jobTitle } = req.body;

  if (!summary) {
    return res.status(400).json({
      success: false,
      message: "Professional summary is required.",
    });
  }

  const result = await improveSummary(summary, jobTitle);

  res.status(200).json({
    success: true,
    result,
  });
});

/**
 * @desc Improve Experience Bullet
 * @route POST /api/ai/experience
 * @access Private
 */
export const improveExperienceController = catchAsync(async (req, res) => {
  const { experience, jobTitle } = req.body;

  if (!experience) {
    return res.status(400).json({
      success: false,
      message: "Experience bullet is required.",
    });
  }

  const result = await improveExperience(experience, jobTitle);

  res.status(200).json({
    success: true,
    result,
  });
});

/**
 * @desc Generate Cover Letter
 * @route POST /api/ai/cover-letter
 * @access Private
 */
export const coverLetterController = catchAsync(async (req, res) => {
  const { resume, company, jobTitle } = req.body;

  if (!resume || !company || !jobTitle) {
    return res.status(400).json({
      success: false,
      message: "Resume, company and job title are required.",
    });
  }

  const result = await createCoverLetter(
    resume,
    company,
    jobTitle
  );

  res.status(200).json({
    success: true,
    result,
  });
});

/**
 * @desc Suggest Missing Skills
 * @route POST /api/ai/skills
 * @access Private
 */
export const skillsController = catchAsync(async (req, res) => {
  const { resume, jobDescription } = req.body;

  if (!resume || !jobDescription) {
    return res.status(400).json({
      success: false,
      message: "Resume and job description are required.",
    });
  }

  const result = await suggestSkills(
    resume,
    jobDescription
  );

  res.status(200).json({
    success: true,
    result,
  });
});

/**
 * @desc Generate Interview Questions
 * @route POST /api/ai/interview
 * @access Private
 */
export const interviewController = catchAsync(async (req, res) => {
  const { resume, jobTitle } = req.body;

  if (!resume || !jobTitle) {
    return res.status(400).json({
      success: false,
      message: "Resume and job title are required.",
    });
  }

  const result = await interviewQuestions(
    resume,
    jobTitle
  );

  res.status(200).json({
    success: true,
    result,
  });
});

/**
 * @desc Generate Entire Resume from Prompt
 * @route POST /api/ai/generate
 * @access Private
 */
export const generateResumeFromPromptController = catchAsync(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({
      success: false,
      message: "Prompt is required.",
    });
  }

  const result = await generateResumeFromPrompt(prompt);

  res.status(200).json({
    success: true,
    resume: result,
  });
});