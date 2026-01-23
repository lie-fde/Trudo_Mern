import { getMonthlyDonationGraphService, getYearlyDonationGraphService } from "../services/DonationGraphService.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
export const getMonthlyDonationGraph = async (req, res) => {
  try {
    const data = await getMonthlyDonationGraphService();
    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Donation Graph Error:", error);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to load donation graph",
    });
  }
};

export const getYearlyDonationGraphController = async (req, res) => {
  try {
    const data = await getYearlyDonationGraphService();

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Yearly donation graph error:", error);

    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch yearly donation graph",
    });
  }
};