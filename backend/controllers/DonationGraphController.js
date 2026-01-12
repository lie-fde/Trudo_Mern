import { getMonthlyDonationGraphService, getYearlyDonationGraphService } from "../services/DonationGraphService.js";

export const getMonthlyDonationGraph = async (req, res) => {
  try {
    const data = await getMonthlyDonationGraphService();
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Donation Graph Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load donation graph",
    });
  }
};

export const getYearlyDonationGraphController = async (req, res) => {
  try {
    const data = await getYearlyDonationGraphService();

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Yearly donation graph error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch yearly donation graph",
    });
  }
};