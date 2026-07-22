import Resume from "../models/Resume.js";
import catchAsync from "../utils/catchAsync.js";
import { generateResumeDocx } from "../services/docx.service.js";

export const downloadResumeDocx = catchAsync(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!resume) {
    return res.status(404).json({
      success: false,
      message: "Resume not found.",
    });
  }

  const buffer = await generateResumeDocx(resume);

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=${resume.title}.docx`
  );

  res.send(buffer);
});