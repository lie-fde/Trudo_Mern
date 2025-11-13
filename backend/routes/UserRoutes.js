import express from 'express'
import { register ,login ,otpVerify , resendOtp} from '../controllers/UserController.js'

const router = express.Router()

router.post("/signup",register)

router.post("/login",login)

router.post("/verify-otp",otpVerify)

router.post("/resend-otp",resendOtp)


export default router;