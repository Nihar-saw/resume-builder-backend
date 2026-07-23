import Resume from "../models/Resume.js";
import ATSReport from "../models/ATSReport.js";
import Activity from "../models/Activity.js";
import DownloadHistory from "../models/DownloadHistory.js";

export const getDashboardData = async (userId) => {
  const totalResumes = await Resume.countDocuments({
    user: userId,
  });

  const resumes = await Resume.find({
    user: userId,
  });

  const averageATS = await ATSReport.aggregate([
    {
      $match: {
        user: userId,
      },
    },
    {
      $group: {
        _id: null,
        avg: {
          $avg: "$overallScore",
        },
      },
    },
  ]);

  const downloads = await DownloadHistory.countDocuments({
    user: userId,
  });

  const recentActivity = await Activity.find({
    user: userId,
  })
    .sort({ createdAt: -1 })
    .limit(10);

  return {
    totalResumes,
    averageATS:
      averageATS.length > 0
        ? Math.round(averageATS[0].avg)
        : 0,
    downloads,
    recentActivity,
    resumes,
  };
};