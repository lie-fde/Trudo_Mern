import { EventReportStatsRepo, exportAdminEvents, getAdminEventReport, getTicketsByStatus, lockTicketRepo } from "../repositories/TicketRepo.js";
import { getEventWithRemainingTicketsRepo } from "../repositories/TicketRepo.js";
import Ticket from "../models/Ticket.js";
import Payment from "../models/Payment.js";
import Events from "../models/Events.js";
import { deleteQR } from "../middlewares/qrCodeUpload.js";
import sendMail from "../utils/sendMail.js";

export const lockTicketService = async ({
  userId,
  eventId,
  quantity,
}) => {
  if (!eventId || !quantity) {
    throw {
      status: 400,
      message: "Event ID and quantity are required",
    };
  }

  if (quantity < 1 || quantity > 5) {
    throw {
      status: 400,
      message: "Minimum 1 and maximum 5 tickets allowed",
    };
  }

  try {
    return await lockTicketRepo({
      userId,
      eventId,
      quantity,
    });
  } catch (err) {
    if (err.message === "EVENT_NOT_FOUND") {
      throw { status: 404, message: "Event not found" };
    }

    if (err.message.startsWith("NOT_ENOUGH_TICKETS")) {
      const available = err.message.split(":")[1];
      throw {
        status: 400,
        code: "TICKETS_NOT_AVAILABLE",
        message: `Only ${available} tickets left`,
      };
    }

    throw { status: 500, message: "Server error" };
  }
};


export const fetchMyTickets = async (userId) => ({
  active: await getTicketsByStatus(userId, "Active"),
  expired: await getTicketsByStatus(userId, "Expired"),
  cancelled: await getTicketsByStatus(userId, "Cancelled"),
});


export const cancelTicketService = async (ticketId, userId , userEmail) => {
  const ticket = await Ticket.findOne({ _id: ticketId, userId }).populate("eventId");
  if (!ticket || ticket.status !== "Active")
    throw new Error("Ticket cannot be cancelled");

  const eventTime = new Date(ticket.eventId.date);
  const diff = eventTime - new Date();
  if (diff < 60 * 60 * 1000)
    throw new Error("Cancellation allowed only before 1 hour");

  ticket.status = "Cancelled";
  ticket.cancelledAt = new Date();
  await ticket.save();

  await deleteQR(ticket._id);


  await Payment.findOneAndUpdate(
    { razorpayPaymentId: ticket.paymentId },
    {
      refundStatus: "pending",
      refundAmount: ticket.eventId.ticketPrice * ticket.quantity,
      refundCreatedAt: new Date(),
    }
  );
const refundAmount = ticket.eventId.ticketPrice * ticket.quantity

await sendMail({
  to: userEmail,
  subject: "Ticket Cancelled – Refund Initiated",
  text: "Your ticket has been cancelled",
  html: `
    <div style="font-family:Arial">
      <h2>Ticket Cancelled</h2>
      <p><strong>Event:</strong> ${ticket.eventId.title} </p>
      <p><strong>Refund Amount:</strong> ₹${refundAmount}</p>
      <p>Refund will be processed within 5–7 working days.</p>
      <hr/>
      <small>Trudo Events</small>
    </div>
  `,
});

};

export const verifyTicket = async (req, res) => {
  const { ticketId } = req.params;

  const ticket = await Ticket.findById(ticketId)
    .populate("eventId");

  if (!ticket) {
    return res.status(404).json({
      valid: false,
      message: "Invalid ticket",
    });
  }

  if (ticket.status !== "Active") {
    return res.json({
      valid: false,
      status: ticket.status,
      message: `Ticket is ${ticket.status}`,
    });
  }

  return res.json({
    valid: true,
    status: "Active",
    ticket: {
      event: ticket.eventId.title,
      date: ticket.eventId.date,
      time: ticket.eventId.eventTime,
      venue: ticket.eventId.venue,
    },
  });
};


export const getAdminEventReportService = async ({
  page,
  limit,
  search,
  eventTitle,
  from,
  to,
}) => {
  // Pagination calculation (same as donation)
  const skip = (page - 1) * limit;

  // Call repo
  const { data, total } = await getAdminEventReport({
    skip,
    limit,
    search,
    eventTitle,
    from,
    to,
  });

  return {
    events: data,          // 👈 frontend will consume this
    total,
    page,
    pages: Math.ceil(total / limit),
  };
};


export const EventReportStatsService = async () => {
  try {
    const stats = await EventReportStatsRepo();
    return { success: true, data: stats };
  } catch (error) {
    console.error("Service Error:", error);
    throw new Error("Failed to fetch event report stats");
  }
};


export const exportAdminEventReportService = async ({
  search,
  eventTitle,
  from,
  to,
}) => {
  return  exportAdminEvents({
    search,
    eventTitle,
    from,
    to,
  });
};
