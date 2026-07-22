import catchAsync from "../utils/catchAsync.js";

import Resume from "../models/Resume.js";

import { generateResumePDF } from "../services/pdf.service.js";

export const downloadResumePDF = catchAsync(async (req, res) => {

    const resume = await Resume.findOne({

        _id: req.params.id,

        user: req.user._id

    });

    if (!resume) {

        return res.status(404).json({

            success: false,

            message: "Resume not found."

        });

    }

    generateResumePDF(resume, res);

});