import catchAsync from "../utils/catchAsync.js";

import { reviewResume } from "../services/ai.service.js";

export const reviewController = catchAsync(async (req, res) => {

const { resume } = req.body;

if (!resume) {

return res.status(400).json({

success:false,

message:"Resume required"

});

}

const review = await reviewResume(resume);

res.json({

success:true,

data:JSON.parse(review)

});

});