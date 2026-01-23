import { lockTicketService , fetchMyTickets , cancelTicketService, getAdminEventReportService, EventReportStatsService, exportAdminEventReportService } from "../services/TicketService.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
export const lockTicketController = async (req, res) => {
  try {
    const result = await lockTicketService({
      userId: req.user.id,
      eventId: req.body.eventId,
      quantity: req.body.quantity,
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      ...result,
    });
  } catch (err) {
    return res.status(err.status || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      code: err.code,
      message: err.message,
    });
  }
};


export const getMyTickets = async (req, res) => {
  const data = await fetchMyTickets(req.user.id);
  res.json({ success: true, data });
};

export const cancelTicket = async (req, res) => {
  try {
    const userEmail = req.user.userEmail
    await cancelTicketService(req.params.ticketId, req.user.id,userEmail);
    res.json({ success: true, message: "Ticket cancelled successfully" });
  } catch (err) {
    res.status(HTTP_STATUS.BAD_REQUEST).json({ success: false, message: err.message });
  }
};




export const getAdminEventReportController = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const search = req.query.search || "";
    const eventTitle = req.query.event || ""; // optional dropdown filter

    let from = req.query.from ? new Date(req.query.from) : null;
    let to = req.query.to ? new Date(req.query.to) : null;

    // Default "to" = today
    if (!to) {
      to = new Date();
    }

    // Include full day range
    if (to) {
      to.setHours(23, 59, 59, 999);
    }

    const result = await getAdminEventReportService({
      page,
      limit,
      search,
      eventTitle,
      from,
      to,
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      ...result,
    });
  } catch (err) {
    console.error("Admin Event Report Error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to fetch event report",
    });
  }
};


export const getEventReportStats = async (req, res) => {
  try {
    const response = await EventReportStatsService();
    return res.status(HTTP_STATUS.OK).json(response);
  } catch (error) {
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


export const exportAdminEventReportController = async (req, res) => {
  try {
    const search = req.query.search || "";
    const eventTitle = req.query.event || "";

    let from = req.query.from ? new Date(req.query.from) : null;
    let to = req.query.to ? new Date(req.query.to) : null;

    if (!to) {
      to = new Date();
    }
    if (to) {
      to.setHours(23, 59, 59, 999);
    }

    const rows = await exportAdminEventReportService({
      search,
      eventTitle,
      from,
      to,
    });

    let csv =
      "Event ID,Event Name,User Email,User Name,Ticket Status,No of Tickets,Date,Amount,Receipt ID,Payment ID\n";

    csv += rows
      .map((row) => {
        const dateStr = new Date(row.date).toISOString().slice(0, 10);

        return [
          row.eventId,
          `"${row.eventName?.replace(/"/g, '""') || ""}"`,
          row.userEmail || "",
          `"${row.userName?.replace(/"/g, '""') || ""}"`,
          row.ticketStatus || "",
          row.numberOfTickets || 0,
          `'${dateStr}`, // 👈 Excel-safe date
          row.amount || 0,
          row.paymentId || "",
        ].join(",");
      })
      .join("\n");

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=event_report.csv"
    );

    return res.status(HTTP_STATUS.OK).send(csv);
  } catch (err) {
    console.error("Admin Event Export Error:", err);
    return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to export event report",
    });
  }
};