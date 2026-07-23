import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    resume:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Resume",
        required:true
    },

    slug:{
        type:String,
        unique:true
    },

    isPublic:{
        type:Boolean,
        default:false
    },

    views:{
        type:Number,
        default:0
    },

    downloads:{
        type:Number,
        default:0
    },

    qrCode:{
        type:String
    }

},
{
    timestamps:true
}
);
export default mongoose.model("Portfolio",portfolioSchema);


export const getPublicResume=async(req,res)=>{

const portfolio=await Portfolio.findOne({

slug:req.params.slug,

isPublic:true

}).populate("resume");

if(!portfolio){

return res.status(404).json({

success:false,

message:"Resume not found."

});

}

portfolio.views++;

await portfolio.save();

res.json({

success:true,

resume:portfolio.resume,

qrCode:portfolio.qrCode,

views:portfolio.views

});

};