import {
  getDonationHistoryService,
  getDonationStatsService,
} from "../services/DonationService.js";

export const getDonationHistoryController = async (req, res) => {
  try {
    const userId = req.user._id;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;
    const search = req.query.search || "";

    const result = await getDonationHistoryService(userId, page, limit, search);

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Donation History Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const getDonationStatsController = async (req, res) => {
  try {
    const userId = req.user._id;

    const stats = await getDonationStatsService(userId);

    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error("Donation stats error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch donation stats",
    });
  }
};
