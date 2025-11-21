import express from 'express'
import { register ,login ,otpVerify , resendOtp ,forgotPassword ,verifyPasswordOtp ,resetPassword ,
    googleCallbackController,
    fetchUsersforPagination,
    resendOtpPassword , refreshTokenController,getMe,
    logoutController
} from '../controllers/UserController/UserController.js'
import { verifyAccessToken } from '../middlewares/verifytoken.js'
import passport from 'passport'

const router = express.Router()

router.post("/signup",register)

router.post("/login",login)

router.post("/verify-otp",otpVerify)

router.post("/resend-otp",resendOtp)

router.get("/refresh-token", refreshTokenController);

router.post("/logout",logoutController)

router.post("/resend-otp-password",resendOtpPassword)

router.post("/change-password",resetPassword)

router.post("/paginated",fetchUsersforPagination)

router.post("/forgot-password",forgotPassword)

router.post('/verify-password-otp', verifyPasswordOtp);

router.get("/google",passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",passport.authenticate("google", { session: false, failureRedirect: "/login" }),
googleCallbackController
);

router.get("/me", verifyAccessToken, getMe);

export default router;