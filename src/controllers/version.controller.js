import Resume from "../models/Resume.js";
import ResumeVersion from "../models/ResumeVersion.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

/*
| Save Resume Version
*/
export const saveVersion = catchAsync(async (req, res) => {

    const resume = await Resume.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!resume) {
        throw new AppError("Resume not found", 404);
    }

    const version = await ResumeVersion.create({
        resume: resume._id,
        user: req.user._id,
        versionNumber: resume.currentVersion,
        snapshot: resume.toObject(),
        createdBy: req.body.createdBy || "manual"
    });

    resume.currentVersion += 1;

    await resume.save();

    res.status(201).json({
        success: true,
        version
    });

});   // <-- THIS WAS MISSING

/*
| Get All Versions
*/
export const getVersions = catchAsync(async (req, res) => {

    const versions = await ResumeVersion.find({
        resume: req.params.resumeId
    }).sort({
        createdAt: -1
    });

    res.status(200).json({
        success: true,
        versions
    });

});

/*
| Restore Version
*/
export const restoreVersion = catchAsync(async (req, res) => {

    // We'll implement this next if it's missing.

});