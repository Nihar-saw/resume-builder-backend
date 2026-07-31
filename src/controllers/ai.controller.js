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

  try {
    const result = await generateResumeFromPrompt(prompt);

    res.status(200).json({
      success: true,
      resume: result,
    });
  } catch (error) {
    console.error("AI Generate Error:", error.message);
    if (error.response) {
      console.error("Groq API Error Data:", error.response.data);
    }

    // Provide user-friendly error messages based on error type
    let userMessage = "Failed to generate resume with AI.";

    if (error.message?.includes("Groq API key is not configured")) {
      userMessage = "Groq API is not configured. Please add GROQ_API_KEY to your .env file.";
    } else if (error.response?.status === 401) {
      userMessage = "Invalid Groq API key. Please check your GROQ_API_KEY in the .env file.";
    } else if (error.message?.includes("Ollama service is not running")) {
      userMessage = "Ollama is not running. Please start Ollama on your computer first.";
    } else if (error.message?.includes("no models are installed")) {
      userMessage = "No AI models installed. Run 'ollama pull gemma' in your terminal.";
    } else if (error.message?.includes("Failed to parse")) {
      userMessage = "AI returned invalid data. Please try again with a simpler prompt.";
    } else if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      userMessage = "AI request timed out. Please try again.";
    } else if (error.response?.data?.error?.message) {
      // If Groq API returns a specific error (e.g. 400 Bad Request, invalid model, etc.)
      userMessage = `Groq API Error: ${error.response.data.error.message}`;
    } else {
      // General fallback
      userMessage = `Error: ${error.message}`;
    }

    res.status(500).json({
      success: false,
      message: userMessage,
    });
  }
});