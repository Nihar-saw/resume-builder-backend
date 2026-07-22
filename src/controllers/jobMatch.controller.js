import catchAsync from "../utils/catchAsync.js";

import { analyzeJobMatch } from "../services/ai.service.js";

export const analyzeJobMatchController = catchAsync(async (req, res) => {

    const { resume, jobDescription } = req.body;

    if (!resume || !jobDescription) {

        return res.status(400).json({

            success: false,

            message: "Resume and Job Description are required."

        });

    }

    const result = await analyzeJobMatch(
        resume,
        jobDescription
    );

    res.status(200).json({

        success: true,

        data: JSON.parse(result)

    });

});