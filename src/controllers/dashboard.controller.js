import catchAsync from "../utils/catchAsync.js";
import { getDashboardData } from "../services/dashboard.service.js";

export const dashboardController = catchAsync(
  async (req, res) => {
    const dashboard = await getDashboardData(req.user._id);

    res.status(200).json({
      success: true,
      data: dashboard,
    });
  }
);