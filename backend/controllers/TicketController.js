import { lockTicketService } from "../services/TicketService.js";

export const lockTicketController = async (req, res) => {
  try {
    const result = await lockTicketService({
      userId: req.user.id,
      eventId: req.body.eventId,
      quantity: req.body.quantity,
    });

    return res.status(200).json({
      success: true,
      ...result,
    });
  } catch (err) {
    return res.status(err.status || 500).json({
      success: false,
      code: err.code,
      message: err.message,
    });
  }
};
