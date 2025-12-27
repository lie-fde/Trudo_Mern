import mongoose from "mongoose";
import Tickets from "../models/Ticket.js";
import Events from "../models/Events.js";

export const lockTicketRepo = async ({
  userId,
  eventId,
  quantity,
}) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const event = await Events.findById(eventId).session(session);
    if (!event) {
      throw new Error("EVENT_NOT_FOUND");
    }

    const now = new Date();

    const reserved = await Tickets.aggregate([
      {
        $match: {
          eventId: event._id,
          $or: [
            { status: "Active" },
            {
              status: "Locked",
              bookingLockExpires: { $gt: now },
            },
          ],
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$quantity" },
        },
      },
    ]).session(session);

    const booked = reserved[0]?.total || 0;
    const available = event.totalTickets - booked;

    if (available < quantity) {
      throw new Error(`NOT_ENOUGH_TICKETS:${available}`);
    }

    const lockExpiry = new Date(Date.now() + 2 * 60 * 1000);

    const [ticket] = await Tickets.create(
      [
        {
          userId,
          eventId,
          quantity,
          status: "Locked",
          bookingLockExpires: lockExpiry,
          expiresAt: new Date(
            new Date(event.date).getTime() +
              event.duration * 60 * 1000
          ),
        },
      ],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    return {
      ticketId: ticket._id,
      lockExpiresAt: lockExpiry,
    };
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    throw err;
  }
};



export const getEventWithRemainingTicketsRepo = async (eventId) => {
  const event = await Events.findById(eventId).lean();
  if (!event) return null;

  const now = new Date();

  const reserved = await Tickets.aggregate([
    {
      $match: {
        eventId: event._id,
        $or: [
          { status: "Active" },
          { status: "Locked", bookingLockExpires: { $gt: now } },
        ],
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$quantity" },
      },
    },
  ]);

  const booked = reserved[0]?.total || 0;

  return {
    remainingTickets: event.totalTickets - booked,
  };
};