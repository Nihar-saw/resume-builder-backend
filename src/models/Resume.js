import mongoose from "mongoose";

const educationSchema = new mongoose.Schema(
  {
    school: {
      type: String,
      required: true,
      trim: true,
    },

    degree: {
      type: String,
      required: true,
      trim: true,
    },

    fieldOfStudy: {
      type: String,
      trim: true,
    },

    startDate: Date,

    endDate: Date,

    grade: String,

    description: String,
  },
  { _id: false }
);

const experienceSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: true,
      trim: true,
    },

    position: {
      type: String,
      required: true,
      trim: true,
    },

    location: String,

    startDate: Date,

    endDate: Date,

    currentlyWorking: {
      type: Boolean,
      default: false,
    },

    description: [String],
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,

    technologies: [String],

    github: String,

    liveDemo: String,
  },
  { _id: false }
);

const certificationSchema = new mongoose.Schema(
  {
    name: String,
    organization: String,
    issueDate: Date,
    credentialUrl: String,
  },
  { _id: false }
);

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      default: "Untitled Resume",
    },

    template: {
      type: String,
      default: "modern",
      enum: [
        "modern",
        "minimal",
        "professional",
        "creative",
        "executive",
      ],
    },
    
    currentVersion: {
      type: Number,
      default: 1
   },
    personalInfo: {
      fullName: String,
      email: String,
      phone: String,
      location: String,
      website: String,
      linkedin: String,
      github: String,
      portfolio: String,
      summary: String,
    },

    education: [educationSchema],

    experience: [experienceSchema],

    skills: [String],

    projects: [projectSchema],

    certifications: [certificationSchema],
    
    languages: [String],
    
    customSections: [
      {
        title: String,
        content: String,
      },
    ],

    // Drag & Drop order
    sectionOrder: {
      type: [String],
      default: [
        "summary",
        "experience",
        "education",
        "skills",
        "projects",
        "certifications",
        "languages",
      ],
    },
    template: {
    type: String,
    enum: [
        "modern",
        "classic",
        "minimal",
        "creative"
    ],
    default: "modern"
    },
    atsScore: {
      type: Number,
      default: 0,
    },

    aiSuggestions: {
      type: [String],
      default: [],
    },

    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Resume = mongoose.model("Resume", resumeSchema);

export default Resume;