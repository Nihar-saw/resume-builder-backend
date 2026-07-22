import Resume from "../models/Resume.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

/**
 * @desc Create Resume
 * @route POST /api/resume
 * @access Private
 */
export const createResume = catchAsync(async (req, res) => {
  const resume = await Resume.create({
    user: req.user._id,
    ...req.body,
  });

  res.status(201).json({
    success: true,
    message: "Resume created successfully.",
    resume,
  });
});

/**
 * @desc Get All User Resumes
 * @route GET /api/resume
 * @access Private
 */
export const getAllResumes = catchAsync(async (req, res) => {
  const resumes = await Resume.find({
    user: req.user._id,
  }).sort({
    updatedAt: -1,
  });

  res.json({
    success: true,
    count: resumes.length,
    resumes,
  });
});

/**
 * @desc Get Resume By Id
 * @route GET /api/resume/:id
 * @access Private
 */
export const getResumeById = catchAsync(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!resume) {
    throw new AppError("Resume not found.", 404);
  }

  res.json({
    success: true,
    resume,
  });
});

/**
 * @desc Update Resume
 * @route PUT /api/resume/:id
 * @access Private
 */
export const updateResume = catchAsync(async (req, res) => {
  const resume = await Resume.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!resume) {
    throw new AppError("Resume not found.", 404);
  }

  res.json({
    success: true,
    message: "Resume updated successfully.",
    resume,
  });
});

/**
 * @desc Delete Resume
 * @route DELETE /api/resume/:id
 * @access Private
 */
export const deleteResume = catchAsync(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!resume) {
    throw new AppError("Resume not found.", 404);
  }

  await resume.deleteOne();

  res.json({
    success: true,
    message: "Resume deleted successfully.",
  });
});

/**
 * @desc Duplicate Resume
 * @route POST /api/resume/:id/duplicate
 * @access Private
 */
export const duplicateResume = catchAsync(async (req, res) => {
  const resume = await Resume.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!resume) {
    throw new AppError("Resume not found.", 404);
  }

  const copiedResume = resume.toObject();

  delete copiedResume._id;
  delete copiedResume.createdAt;
  delete copiedResume.updatedAt;

  copiedResume.title = `${resume.title} (Copy)`;

  const newResume = await Resume.create({
    ...copiedResume,
  });

  res.status(201).json({
    success: true,
    message: "Resume duplicated successfully.",
    resume: newResume,
  });
});