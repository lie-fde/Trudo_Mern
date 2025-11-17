import express from 'express'
import { register ,login ,otpVerify , resendOtp ,forgotPassword ,verifyPasswordOtp ,resetPassword ,
    googleCallbackController
} from '../controllers/UserController.js'
import passport from 'passport'

const router = express.Router()

router.post("/signup",register)

router.post("/login",login)

router.post("/verify-otp",otpVerify)

router.post("/resend-otp",resendOtp)

router.post("/change-password",resetPassword)

router.post("/forgot-password",forgotPassword)

router.post('/verify-password-otp', verifyPasswordOtp);

router.get("/google",passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback",passport.authenticate("google", { session: false, failureRedirect: "/login" }),
googleCallbackController
);

export default router;