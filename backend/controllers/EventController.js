import { createEventService } from "../services/EventService.js";
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
