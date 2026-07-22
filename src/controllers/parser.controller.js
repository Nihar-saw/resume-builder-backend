import catchAsync from "../utils/catchAsync.js";

import { extractResumeText } from "../services/parser.service.js";

import { parseResume } from "../services/ai.service.js";

export const parseResumeController = catchAsync(async (req, res) => {

    if (!req.file) {

        return res.status(400).json({

            success: false,

            message: "Resume file required."

        });

    }

    const text = await extractResumeText(req.file);

    const parsed = await parseResume(text);

    res.json({

        success: true,

        data: JSON.parse(parsed)

    });

});