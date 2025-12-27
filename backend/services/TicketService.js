import { lockTicketRepo } from "../repositories/TicketRepo.js";
import { getEventWithRemainingTicketsRepo } from "../repositories/TicketRepo.js";

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


