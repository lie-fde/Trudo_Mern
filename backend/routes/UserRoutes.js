import express from 'express'
import { register ,login ,otpVerify , resendOtp ,forgotPassword ,verifyPasswordOtp ,resetPassword } from '../controllers/UserController.js'

const router = express.Router()

router.post("/signup",register)

router.post("/login",login)

router.post("/verify-otp",otpVerify)

router.post("/resend-otp",resendOtp)

router.post("/change-password",resetPassword)

router.post("/forgot-password",forgotPassword)

router.post('/verify-password-otp', verifyPasswordOtp);


export default router;