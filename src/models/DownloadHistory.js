import mongoose from "mongoose";

const downloadHistorySchema = new mongoose.Schema(
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

    format: {
      type: String,
      enum: ["PDF", "DOCX"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "DownloadHistory",
  downloadHistorySchema
);