import {
  getAdminDonationReportService,
  exportAdminDonationReportService,
  DonationReportStatsService,
} from "../services/adminDonationService.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";

export const getAdminDonationReportController = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const search = req.query.search || "";
    const campaignTitle = req.query.campaign || "";

    let from = req.query.from ? new Date(req.query.from) : null;
    let to = req.query.to ? new Date(req.query.to) : null;

    if (!to) {
      to = new Date();
    }

    if (to) {
      to.setHours(23, 59, 59, 999);
    }

    const result = await getAdminDonationReportService({
      page,
      limit,
      search,
      campaignTitle,
      from,
      to,
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error("Admin Donation Report Error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch donation report",
    });
  }
};

export const exportAdminDonationReportController = async (req, res) => {
  try {
    const search = req.query.search || "";
    const campaignTitle = req.query.campaign || "";

    let from = req.query.from ? new Date(req.query.from) : null;
    let to = req.query.to ? new Date(req.query.to) : null;

    if (!to) {
      to = new Date();
    }
    if (to) {
      to.setHours(23, 59, 59, 999);
    }

    const rows = await exportAdminDonationReportService({
      search,
      campaignTitle,
      from,
      to,
    });

    let csv =
      "Campaign ID,Campaign Name,User Email,User Name,Date,Amount,Receipt ID,Payment ID\n";

    csv += rows
      .map((row) => {
        const dateStr = new Date(row.date).toISOString().slice(0, 10);
        return [
          row.campaignId,
          `"${row.campaignName?.replace(/"/g, '""') || ""}"`,
          row.userEmail || "",
          `"${row.userName?.replace(/"/g, '""') || ""}"`,
           `${dateStr}`,
          row.amount,
          row.receiptId || "",
          row.paymentId || "",
        ].join(",");
      })
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=donation_report.csv"
    );
    return res.status(HTTP_STATUS.OK).send(csv);
  } catch (err) {
    console.error("Admin Donation Export Error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to export donation report",
    });
  }
};

export const getDonationReportStats = async (req, res) => {
  try {
    const response = await DonationReportStatsService();
    return res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
