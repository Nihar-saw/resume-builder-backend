import Resume from "../models/Resume.js";
import ResumeVersion from "../models/ResumeVersion.js";
import catchAsync from "../utils/catchAsync.js";
import AppError from "../utils/AppError.js";

/*
    Save Version
*/
export const saveVersion = catchAsync(async (req, res) => {

    const resume = await Resume.findOne({
        _id: req.params.id,
        user: req.user._id
    });

    if (!resume)
        throw new AppError("Resume not found",404);

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

        success:true,

        version

    });

});