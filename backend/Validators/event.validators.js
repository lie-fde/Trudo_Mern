import { body , param ,validationResult } from "express-validator";

export const createEventValidators = [
  body("title").trim().notEmpty().withMessage("Title is required"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),

  body("venue")
    .trim()
    .notEmpty()
    .withMessage("Venue is required"),

  body("eventTime")
    .notEmpty()
    .withMessage("Event time is required"),

  body("date")
    .notEmpty()
    .withMessage("Event date is required")
    .isISO8601()
    .withMessage("Invalid date format"),

  body("duration")
    .notEmpty()
    .withMessage("Duration is required")
    .isFloat({ gt: 0 })
    .withMessage("Duration must be greater than 0"),

  body("ticketPrice")
    .notEmpty()
    .withMessage("Ticket price is required")
    .isFloat({ min: 0 })
    .withMessage("Ticket price must be >= 0"),

  body("totalTickets")
    .notEmpty()
    .withMessage("Total tickets is required")
    .isInt({ gt: 0 })
    .withMessage("Total tickets must be > 0"),
];


export const updateEventStatusValidator = [
  body("status")
    .notEmpty().withMessage("Status is required")
    .isIn(["Approved", "Rejected"])
    .withMessage("Invalid status value"),

  body("rejectionReason")
    .custom((value, { req }) => {
      if (req.body.status === "Rejected" && (!value || value.trim() === "")) {
        throw new Error("Rejection reason is required when rejecting an event");
      }
      return true;
    }),
];


export const getSingleEventValidator = [
  param("eventId")
    .isMongoId()
    .withMessage("Invalid event ID format"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors.array(),
      });
    }
    next();
  }
];