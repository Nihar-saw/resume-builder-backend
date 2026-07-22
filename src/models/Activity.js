import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      enum: [
        "CREATE_RESUME",
        "UPDATE_RESUME",
        "DELETE_RESUME",
        "DOWNLOAD_PDF",
        "DOWNLOAD_DOCX",
        "ATS_CHECK",
        "AI_REVIEW",
        "JOB_MATCH",
      ],
      required: true,
    },

    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
    },

    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Activity", activitySchema);