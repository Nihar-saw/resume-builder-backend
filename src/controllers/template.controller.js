import Resume from "../models/Resume.js";

import catchAsync from "../utils/catchAsync.js";

export const changeTemplate=catchAsync(async(req,res)=>{

const {template}=req.body;

const resume=await Resume.findOne({

_id:req.params.id,

user:req.user._id

});

if(!resume){

return res.status(404).json({

success:false,

message:"Resume not found."

});

}

resume.template=template;

await resume.save();

res.json({

success:true,

resume

});

});