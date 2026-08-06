import ollama from "../config/ollama.js";
import { env } from "../config/env.js";
import axios from "axios";

export const askAI = async (prompt) => {
  let model = env.OLLAMA_MODEL || "gemma";

  // Dynamic model check to prevent hardcoding a single missing model
  try {
    const { data: tagData } = await ollama.get("/api/tags");
    const installedModels = tagData.models || [];
    if (installedModels.length > 0) {
      // Use configured model if present, otherwise auto-select the first installed model
      const hasDefault = installedModels.some(
        (m) => m.name === model || m.name.startsWith(model + ":")
      );
      if (!hasDefault) {
        model = installedModels[0].name;
      }
    } else {
      throw new Error(
        "Ollama is running, but no models are installed. Please run 'ollama pull gemma' or another model in your terminal."
      );
    }
  } catch (error) {
    if (error.message.includes("no models are installed")) {
      throw error;
    }
    throw new Error(
      "Ollama service is not running on http://localhost:11434. Please start the Ollama application."
    );
  }

  const { data } = await ollama.post("/api/chat", {
    model,
    stream: false,
    format: "json",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return data.message.content;
};

export const askGroq = async (prompt) => {
  if (!env.GROQ_API_KEY || env.GROQ_API_KEY === "your_groq_api_key_here") {
    throw new Error("Groq API key is not configured. Please add GROQ_API_KEY to your .env file.");
  }

  const response = await axios.post(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      model: "llama-3.3-70b-versatile",
      stream: false,
      messages: [
        {
          role: "system",
          content: "You are a highly skilled professional resume writer. Always output strictly valid JSON as requested, with no markdown formatting or additional text.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 120000, // 2 minutes timeout for external API
    }
  );

  return response.data.choices[0].message.content;
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
"strengths":[],
"weaknesses":[],
"grammarIssues":[],
"missingKeywords":[],
"missingSections":[],
"recommendations":[]
}

Resume
${resume}
`;
  return await askAI(prompt);
};

export const improveSummary = async (summary, jobTitle = "Software Developer") => {
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

export const improveExperience = async (experience, jobTitle = "Software Developer") => {
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

export const suggestSkills = async (resume, jobDescription = "") => {
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

export const interviewQuestions = async (resume, jobTitle = "Software Developer") => {
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

export const createCoverLetter = async (resume, company = "Target Company", jobTitle = "Software Developer") => {
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

export const analyzeJobMatch = async (resume, jobDescription) => {
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

export const generateResumeFromPrompt = async (promptText) => {
  const prompt = `
You are an expert AI Resume Writer.
Based on the following user prompt, generate a highly detailed, professional resume in JSON format.
Make up realistic details like company names, bullet point achievements (using strong action verbs and STAR method), location, project titles, technologies, and skills if not fully specified in the prompt.

User Prompt:
${promptText}

Return ONLY valid JSON matching this format (do not include markdown wrapping or other text):
{
  "personalInfo": {
    "fullName": "Name from prompt or a realistic default",
    "email": "email@example.com",
    "phone": "+1 123 456 7890",
    "location": "City, State",
    "website": "example.com",
    "linkedin": "linkedin.com/in/username",
    "github": "github.com/username",
    "portfolio": "portfolio.com",
    "summary": "Detailed professional summary based on the prompt (approx. 70-100 words)"
  },
  "skills": ["Skill1", "Skill2", "Skill3", "Skill4", "Skill5", "Skill6"],
  "education": [
    {
      "school": "University Name",
      "degree": "Degree (e.g. BS)",
      "fieldOfStudy": "Major (e.g. Computer Science)",
      "startDate": "2018-09-01",
      "endDate": "2022-06-01"
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "position": "Job Title",
      "location": "City, State",
      "startDate": "2022-07-01",
      "endDate": "2025-01-01",
      "currentlyWorking": false,
      "description": [
        "First detailed accomplishment bullet using STAR method.",
        "Second detailed accomplishment bullet using STAR method.",
        "Third detailed accomplishment bullet using STAR method."
      ]
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "description": "Detailed description of the project and what it does.",
      "technologies": ["Tech1", "Tech2", "Tech3"]
    }
  ]
}
`;

  const maxRetries = 0;
  
  const aiResponse = await askGroq(prompt);
  if (!aiResponse) {
    throw new Error("The AI model returned an empty response. Please try again.");
  }
  let cleanJson = aiResponse.trim();

  // Strategy 1: Strip markdown code fences (```json ... ``` or ``` ... ```)
  const fenceMatch = cleanJson.match(/```(?:json)?\s*\n?([\s\S]*?)```/);
  if (fenceMatch) {
    cleanJson = fenceMatch[1].trim();
  }

  // Strategy 2: Extract the outermost { ... } block
  const jsonStart = cleanJson.indexOf("{");
  const jsonEnd = cleanJson.lastIndexOf("}");
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    cleanJson = cleanJson.substring(jsonStart, jsonEnd + 1);
  }

  // Strategy 3: Fix common LLM JSON issues before parsing
  // Remove trailing commas before } or ]
  cleanJson = cleanJson.replace(/,\s*([}\]])/g, "$1");

  try {
    return JSON.parse(cleanJson);
  } catch (parseError) {
    console.error("AI resume generation JSON parse failed:", parseError.message);
    console.error("Raw response was:", cleanJson);
    throw new Error(
      `Failed to parse AI-generated resume. ` +
      `The AI model produced invalid JSON. Error: ${parseError.message}`
    );
  }
};