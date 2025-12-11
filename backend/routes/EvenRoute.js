import express from 'express'
import rateLimit from "express-rate-limit";
import { createEventController  , getPendingEventsController ,updateEventStatusController,
    getSingleEventController
} from "../controllers/EventController.js";
import { createEventValidators , updateEventStatusValidator, getSingleEventValidator} from "../Validators/event.validators.js";
import uploadEventImage from '../middlewares/UploadEventImage.js';
import auth from '../middlewares/auth.js';

const router = express.Router()

const eventCreateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many event creation attempts. Please try again later.",
  },
});

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
router.patch("/:eventId/status",auth , eventCreateLimiter, updateEventStatusValidator, updateEventStatusController);


router.get(
  "/:eventId",
  eventCreateLimiter,
  getSingleEventValidator,
  getSingleEventController
);


export default router