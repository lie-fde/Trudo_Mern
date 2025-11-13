import express from 'express'
import { register ,login ,otpVerify } from '../controllers/UserController.js'

const router = express.Router()

router.post("/signup",register)

router.post("/login",login)

router.post("/verify-otp",otpVerify)


export default router;