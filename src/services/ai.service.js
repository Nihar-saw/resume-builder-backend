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

export const analyzeJobMatch = async (
  resume,
  jobDescription
) => {

const prompt = `

You are an expert ATS Recruiter.

Compare this resume with the job description.

Return ONLY valid JSON.

Format:

{
"matchScore":0,

"matchingSkills":[

],

"missingSkills":[

],

"matchingKeywords":[

],

"missingKeywords":[

],

"experienceGap":"",

"suggestedProjects":[

],

"resumeImprovements":[

],

"interviewTips":[

],

"hiringRecommendation":""

}

Resume

${resume}

Job Description

${jobDescription}

`;

return await askAI(prompt);

};