import { getMonthlyDonationGraphService } from "../services/DonationGraphService.js";

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

