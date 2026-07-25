import Resume from "../models/Resume.js";
import ATSReport from "../models/ATSReport.js";
import { askAI } from "./ai.service.js";
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

  // Build a readable resume text for the AI prompt
  const resumeText = buildResumeText(resume);

  const prompt = `
You are an expert ATS (Applicant Tracking System) analyzer and HR recruiter.
Analyze the following resume against the provided job description.
Return ONLY valid JSON (no markdown, no extra text).

Format:
{
  "overallScore": 0,
  "keywordScore": 0,
  "formattingScore": 0,
  "contentScore": 0,
  "matchedKeywords": [],
  "missingKeywords": [],
  "suggestions": [],
  "strengths": [],
  "weaknesses": []
}

Scoring rules:
- "overallScore": overall ATS compatibility (0-100)
- "keywordScore": percentage of job description keywords found in resume (0-100)
- "formattingScore": how well the resume is structured for ATS parsing (0-100)
- "contentScore": quality and relevance of the resume content (0-100)
- "matchedKeywords": array of keywords from the job description that ARE present in the resume
- "missingKeywords": array of important keywords from the job description that are MISSING from the resume
- "suggestions": array of specific, actionable recommendations to improve ATS compatibility
- "strengths": array of resume strengths
- "weaknesses": array of resume weaknesses

Job Title: ${jobTitle || "Not specified"}

Job Description:
${jobDescription}

Resume:
${resumeText}
`;

  const aiResponse = await askAI(prompt);

  // Parse the JSON response from the AI
  let result;
  try {
    let cleanJson = aiResponse.trim();
    // Strip markdown fences if present
    if (cleanJson.startsWith("```")) {
      const lines = cleanJson.split("\n");
      if (lines[0].includes("```")) {
        cleanJson = lines.slice(1, -1).join("\n").trim();
      }
    }
    const jsonStart = cleanJson.indexOf("{");
    const jsonEnd = cleanJson.lastIndexOf("}");
    if (jsonStart !== -1 && jsonEnd !== -1) {
      cleanJson = cleanJson.substring(jsonStart, jsonEnd + 1);
    }
    result = JSON.parse(cleanJson);
  } catch (parseError) {
    throw new AppError(
      "AI returned an invalid response. Please try again.",
      500
    );
  }

  // Normalize fields with safe defaults
  const overallScore = clampScore(result.overallScore);
  const keywordScore = clampScore(result.keywordScore);
  const formattingScore = clampScore(result.formattingScore);
  const contentScore = clampScore(result.contentScore);
  const matchedKeywords = Array.isArray(result.matchedKeywords) ? result.matchedKeywords : [];
  const missingKeywords = Array.isArray(result.missingKeywords) ? result.missingKeywords : [];

  // Merge strengths/weaknesses into suggestions for storage
  const suggestions = [];
  if (Array.isArray(result.suggestions)) suggestions.push(...result.suggestions);
  if (Array.isArray(result.strengths) && result.strengths.length > 0) {
    suggestions.push(`Strengths: ${result.strengths.join("; ")}`);
  }
  if (Array.isArray(result.weaknesses) && result.weaknesses.length > 0) {
    suggestions.push(`Weaknesses: ${result.weaknesses.join("; ")}`);
  }

  // Save score in Resume
  resume.atsScore = overallScore;
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
      overallScore,
      keywordScore,
      formattingScore,
      contentScore,
      matchedKeywords,
      missingKeywords,
      suggestions,
    },
    {
      upsert: true,
      new: true,
    }
  );

  return report;
};

/**
 * Clamp a score value to 0-100 integer range.
 */
function clampScore(value) {
  const num = Number(value);
  if (isNaN(num)) return 0;
  return Math.max(0, Math.min(100, Math.round(num)));
}

/**
 * Build a human-readable text representation of a resume document
 * for use in AI prompts.
 */
function buildResumeText(resume) {
  const parts = [];

  if (resume.personalInfo) {
    const pi = resume.personalInfo;
    parts.push("--- Personal Info ---");
    if (pi.fullName) parts.push(`Name: ${pi.fullName}`);
    if (pi.email) parts.push(`Email: ${pi.email}`);
    if (pi.phone) parts.push(`Phone: ${pi.phone}`);
    if (pi.location) parts.push(`Location: ${pi.location}`);
    if (pi.summary) parts.push(`Summary: ${pi.summary}`);
  }

  if (resume.skills && resume.skills.length > 0) {
    parts.push("\n--- Skills ---");
    parts.push(resume.skills.join(", "));
  }

  if (resume.experience && resume.experience.length > 0) {
    parts.push("\n--- Experience ---");
    resume.experience.forEach((exp) => {
      parts.push(`${exp.position || "Role"} at ${exp.company || "Company"}`);
      if (exp.startDate) parts.push(`  Period: ${exp.startDate} - ${exp.currentlyWorking ? "Present" : exp.endDate || "N/A"}`);
      if (Array.isArray(exp.description)) {
        exp.description.forEach((d) => parts.push(`  • ${d}`));
      } else if (exp.description) {
        parts.push(`  ${exp.description}`);
      }
    });
  }

  if (resume.education && resume.education.length > 0) {
    parts.push("\n--- Education ---");
    resume.education.forEach((edu) => {
      parts.push(`${edu.degree || ""} in ${edu.fieldOfStudy || ""} from ${edu.school || "School"}`);
    });
  }

  if (resume.projects && resume.projects.length > 0) {
    parts.push("\n--- Projects ---");
    resume.projects.forEach((proj) => {
      parts.push(`${proj.title || "Project"}: ${proj.description || ""}`);
      if (proj.technologies && proj.technologies.length > 0) {
        parts.push(`  Tech: ${proj.technologies.join(", ")}`);
      }
    });
  }

  if (resume.certifications && resume.certifications.length > 0) {
    parts.push("\n--- Certifications ---");
    resume.certifications.forEach((cert) => {
      parts.push(typeof cert === "string" ? cert : cert.name || JSON.stringify(cert));
    });
  }

  return parts.join("\n");
}