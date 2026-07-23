import ollama from "../config/ollama.js";
import { env } from "../config/env.js";

export const askAI = async (prompt) => {
  const { data } = await ollama.post("/api/chat", {
    model: env.OLLAMA_MODEL,
    stream: false,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return data.message.content;
};

export const parseResume = async (resumeText) => {

const prompt = `

You are an expert resume parser.

Extract the resume into JSON.

Return ONLY valid JSON.

Format:

{
"personalInfo":{

"fullName":"",
"email":"",
"phone":"",
"location":"",
"linkedin":"",
"github":"",
"portfolio":""
},

"summary":"",

"skills":[],

"education":[],

"experience":[],

"projects":[],

"certifications":[],

"languages":[]

}

Resume

${resumeText}
`;
return await askAI(prompt);
};

export const reviewResume = async (resume) => {

const prompt = `

You are an ATS Expert, HR Recruiter and Resume Reviewer.

Analyze this resume.

Return ONLY valid JSON.

Format:

{
"overallScore":0,
"atsScore":0,
"grammarScore":0,
"impactScore":0,

"strengths":[

],

"weaknesses":[

],

"grammarIssues":[

],

"missingKeywords":[

],

"missingSections":[

],

"recommendations":[

]

}

Resume

${resume}

`;

return await askAI(prompt);

};

export const improveSummary = async (summary, jobTitle) => {

  const prompt = `
You are an expert ATS Resume Writer.

Rewrite this professional summary.

Job Role:
${jobTitle}

Summary:
${summary}

Rules:
- Maximum 100 words
- ATS Friendly
- Professional
- Strong action verbs
`;

  return await askAI(prompt);
};

export const improveExperience = async (
  experience,
  jobTitle
) => {

  const prompt = `
Rewrite the following resume bullet.

Use STAR method.

Job Role:
${jobTitle}

Bullet:
${experience}
`;

  return await askAI(prompt);
};

export const suggestSkills = async (
  resume,
  jobDescription
) => {

  const prompt = `
Compare the resume and the job description.

Return ONLY the missing technical skills.

Resume:
${resume}

Job Description:
${jobDescription}
`;

  return await askAI(prompt);
};

export const interviewQuestions = async (
  resume,
  jobTitle
) => {

  const prompt = `
Generate 10 interview questions.

Role:
${jobTitle}

Resume:
${resume}

Mix technical and behavioral questions.
`;

  return await askAI(prompt);
};

export const createCoverLetter = async (
  resume,
  company,
  jobTitle
) => {
  const prompt = `
You are an expert cover letter writer.

Write a professional ATS-friendly cover letter.

Company:
${company}

Job Title:
${jobTitle}

Resume:
${resume}

Requirements:
- Professional tone
- Around 300 words
- Highlight relevant experience
- End with a strong closing paragraph
`;

  return await askAI(prompt);
};

export const analyzeJobMatch = async (
  resume,
  jobDescription
) => {

  const prompt = `
You are an expert ATS recruiter.

Compare the resume with the job description.

Return ONLY valid JSON.

Format:
{
  "matchScore": 0,
  "matchingSkills": [],
  "missingSkills": [],
  "matchingKeywords": [],
  "missingKeywords": [],
  "experienceGap": "",
  "suggestedProjects": [],
  "resumeImprovements": [],
  "interviewTips": [],
  "hiringRecommendation": ""
}

Resume:
${resume}

Job Description:
${jobDescription}
`;

  return await askAI(prompt);
};