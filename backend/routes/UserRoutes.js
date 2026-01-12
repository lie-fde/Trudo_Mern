import express from "express";
import {
  register,
  login,
  otpVerify,
  resendOtp,
  forgotPassword,
  verifyPasswordOtp,
  resetPassword,
  googleCallbackController,
  fetchUsersforPagination,
  resendOtpPassword,
  refreshTokenController,
  getMe,
  logoutController,
  getUserProfileController,
  verifyOtpControllerProfile,
  sendOtpControllerProfile,
  updateUserProfileController,
  changePassword
} from "../controllers/UserController/UserController.js";
import {
  getUserCampaignsController,
  getCampaignById,
} from "../controllers/UserController/campaignController.js";
import { updateCampaignController } from "../controllers/AdminController/AdminController.js";
import { verifyAccessToken } from "../middlewares/verifytoken.js";
import passport from "passport";
import auth from "../middlewares/auth.js";
import profileUpload from "../middlewares/profileUpload.js";
import upload from "../middlewares/upload.js";
import {
  getDonationHistoryController,
  getDonationStatsController,
} from "../controllers/donationController.js";
import { getSingleEventController } from "../controllers/EventController.js";
import { getSingleEventValidator } from "../Validators/event.validators.js";
import rateLimit from "express-rate-limit";
import { getMyTickets, lockTicketController , cancelTicket } from "../controllers/TicketController.js";
import { createOrderController, verifyPaymentEvent } from "../controllers/paymentController.js";
import { changePasswordValidator } from "../Validators/Profile.validators.js";
import { verifyTicket } from "../services/TicketService.js";

const router = express.Router();

const eventCreateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100,
  message: {
    success: false,
    message: "Too many event creation attempts. Please try again later.",
  },
});

router.post("/signup", register);

router.post("/login", login);

router.post("/verify-otp", otpVerify);

router.post("/resend-otp", resendOtp);

router.get("/refresh-token", refreshTokenController);

router.post("/logout", logoutController);

router.post("/resend-otp-password", resendOtpPassword);

router.post("/change-password", resetPassword);

router.post("/paginated", fetchUsersforPagination);

router.post("/forgot-password", forgotPassword);

router.post("/verify-password-otp", verifyPasswordOtp);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  googleCallbackController
);

router.get("/profile", auth, getUserProfileController);

router.get("/profile/send-otp", auth, sendOtpControllerProfile);

router.post("/profile/verify-otp", auth, verifyOtpControllerProfile);

router.put(
  "/profile/update",
  auth,
  profileUpload.single("avatar"),
  updateUserProfileController
);

router.get("/mycampaigns", auth, getUserCampaignsController);

router.patch(
  "/campaign/update/:id",
  auth,
  (req, res, next) => {
    upload.fields([
      { name: "orgProof", maxCount: 1 },
      { name: "campaignImage", maxCount: 1 },
      { name: "campaignDocs", maxCount: 1 },
    ])(req, res, (err) => {
      if (err) {
        console.error("MULTER ERROR:", err);
        return res
          .status(400)
          .json({ message: "Upload failed", error: err.message });
      }
      next();
    });
  },
  updateCampaignController
);

router.get("/campaigns/:id", auth, getCampaignById);

router.get("/me", verifyAccessToken, getMe);

router.get("/donations/history", auth, getDonationHistoryController);

router.get("/donations/stats", auth, getDonationStatsController);

router.get(
  "/events/:eventId",
  auth,
  eventCreateLimiter,
  getSingleEventValidator,
  getSingleEventController
);

router.post("/ticket/lock", auth , lockTicketController)

router.post("/payment/create-order" , auth , createOrderController)

router.post("/payment/verify", auth ,verifyPaymentEvent )

router.put("/changePassword-UserProfile" , auth ,  changePasswordValidator,
  changePassword)

router.get("/my-tickets", auth, getMyTickets);

router.patch("/tickets/cancel/:ticketId", auth, cancelTicket);

router.get("/verify-ticket/:ticketId", verifyTicket)

export default router;
