import mongoose from "mongoose";

const resumeVersionSchema = new mongoose.Schema(
  {
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    versionNumber: {
      type: Number,
      required: true,
    },

    snapshot: {
      type: Object,
      required: true,
    },

    createdBy: {
      type: String,
      enum: ["manual", "autosave", "ai"],
      default: "manual",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("ResumeVersion", resumeVersionSchema);