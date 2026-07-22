import { COMMON_TECH_KEYWORDS } from "./keywords.js";

export const calculateATS = (resume, jobDescription = "") => {

  const text = JSON.stringify(resume).toLowerCase();

  const jd = jobDescription.toLowerCase();

  const matchedKeywords = [];

  const missingKeywords = [];

  COMMON_TECH_KEYWORDS.forEach((keyword) => {

    const inResume = text.includes(keyword);

    const inJD = jd.includes(keyword);

    if (inJD && inResume) {

      matchedKeywords.push(keyword);

    }

    if (inJD && !inResume) {

      missingKeywords.push(keyword);

    }

  });

  const keywordScore =
    jd.length === 0
      ? 0
      : Math.min(
          100,
          Math.round(
            (matchedKeywords.length /
              (matchedKeywords.length + missingKeywords.length || 1)) *
              100
          )
        );

  let formattingScore = 100;

  if (!resume.personalInfo?.email) formattingScore -= 15;

  if (!resume.personalInfo?.phone) formattingScore -= 15;

  if (!resume.personalInfo?.summary) formattingScore -= 10;

  let contentScore = 100;

  if (!resume.experience?.length) contentScore -= 25;

  if (!resume.education?.length) contentScore -= 15;

  if (!resume.projects?.length) contentScore -= 20;

  if (!resume.skills?.length) contentScore -= 20;

  const overallScore = Math.round(

    keywordScore * 0.5 +

    formattingScore * 0.25 +

    contentScore * 0.25

  );

  const suggestions = [];

  if (missingKeywords.length > 0)

    suggestions.push("Add missing technical keywords from the job description.");

  if (!resume.projects?.length)

    suggestions.push("Include at least two relevant projects.");

  if (!resume.experience?.length)

    suggestions.push("Add professional experience or internships.");

  if (!resume.personalInfo?.summary)

    suggestions.push("Write a professional summary.");

  return {

    overallScore,

    keywordScore,

    formattingScore,

    contentScore,

    matchedKeywords,

    missingKeywords,

    suggestions,

  };

};