import mongoose from "mongoose";

const atsReportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    overallScore: {
      type: Number,
      default: 0,
    },

    keywordScore: {
      type: Number,
      default: 0,
    },

    formattingScore: {
      type: Number,
      default: 0,
    },

    contentScore: {
      type: Number,
      default: 0,
    },

    missingKeywords: {
      type: [String],
      default: [],
    },

    matchedKeywords: {
      type: [String],
      default: [],
    },

    suggestions: {
      type: [String],
      default: [],
    },

    analyzedJobTitle: {
      type: String,
      default: "",
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ATSReport", atsReportSchema);