import express from 'express'
import rateLimit from "express-rate-limit";
import { createEventController } from "../controllers/EventController.js";
import { createEventValidators } from "../Validators/event.validators.js";
import uploadEventImage from '../middlewares/UploadEventImage.js';
import auth from '../middlewares/auth.js';

const router = express.Router()

const eventCreateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
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

export default router