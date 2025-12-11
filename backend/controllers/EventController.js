import { createEventService  , getPendingEventsService, updateEventStatusService ,getSingleEventService} from "../services/EventService.js";
import { validationResult } from "express-validator";

export const createEventController = async (req, res) => {
  try {

   const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array(),
      });
    }


    const id= req.admin?._id || req.user?._id; // from adminAuth
     // Cloudinary image already uploaded

    if (!req.file || req.file.length === 0) {
  return res.status(400).json({
    success: false,
    message: "At least one event image is required",
  });
}

const file = req.file;

    const event = await createEventService(id, req.body, file);

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


export const getPendingEventsController = async (req, res, next) => {
  try {
    const events = await getPendingEventsService();
    console.log(events)
    return res.status(200).json({
      success: true,
      events,
    });
  } catch (err) {
    next(err);
  }
};

export const updateEventStatusController = async (req, res, next) => {
  try {
    // validate request body using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { eventId } = req.params;
    const { status, rejectionReason } = req.body;

    const updatedEvent = await updateEventStatusService(
      eventId,
      status,
      rejectionReason
    );

    if (!updatedEvent) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Event status updated successfully",
      event: updatedEvent,
    });
  } catch (err) {
    next(err);
  }
};



export const getSingleEventController = async (req, res) => {
  try {
    const { eventId } = req.params;

    const result = await getSingleEventService(eventId);

    return res.status(result.statusCode).json({
      success: result.success,
      event: result.data || null,
      message: result.message,
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};