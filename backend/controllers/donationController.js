import {
  getDonationHistoryService,
  getDonationStatsService,
} from "../services/DonationService.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";

export const getDonationHistoryController = async (req, res) => {
  try {
    const userId = req.user._id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = req.query.search || "";

    const result = await getDonationHistoryService(userId, page, limit, search);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Donation History Error:", error);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getDonationStatsController = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await getDonationStatsService(userId);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Donation stats error:", error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch donation stats",
    });
  }
};
