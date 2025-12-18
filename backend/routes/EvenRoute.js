import express from "express";
import rateLimit from "express-rate-limit";
import {
  createEventController,
  getPendingEventsController,
  updateEventStatusController,
  getSingleEventController,
  getAllEvents,
  blockEventController,
  unblockEventController,
  deleteEventController,
  getEventsUserController,
} from "../controllers/EventController.js";
import {
  createEventValidators,
  updateEventStatusValidator,
  getSingleEventValidator,
  getEventsUserValidator,
} from "../Validators/event.validators.js";
import uploadEventImage from "../middlewares/UploadEventImage.js";
import auth from "../middlewares/auth.js";
import adminAuth from "../middlewares/adminAuth.js";

const router = express.Router();

const eventCreateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 1000,
  message: {
    success: false,
    message: "Too many event creation attempts. Please try again later.",
  },
});

router.get("/list", auth, getEventsUserController);

router.post(
  "/create",
  auth,
  eventCreateLimiter,
  uploadEventImage.single("eventImages"), // Cloudinary upload
  createEventValidators,
  createEventController
);

router.get("/pending", eventCreateLimiter, getPendingEventsController);

// PATCH update event status
router.patch(
  "/:eventId/status",
  auth,
  eventCreateLimiter,
  updateEventStatusValidator,
  updateEventStatusController
);

router.get(
  "/:eventId",
  adminAuth,
  eventCreateLimiter,
  getSingleEventValidator,
  getSingleEventController
);

router.get("/", adminAuth, eventCreateLimiter, getAllEvents);

router.patch(
  "/block/:eventId",
  adminAuth,
  eventCreateLimiter,
  getSingleEventValidator,
  blockEventController
);

router.patch(
  "/unblock/:eventId",
  adminAuth,
  eventCreateLimiter,
  getSingleEventValidator,
  unblockEventController
);

router.patch(
  "/delete/:eventId",
  adminAuth,
  eventCreateLimiter,
  getSingleEventValidator,
  deleteEventController
);

export default router;
