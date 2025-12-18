import OtpRepository from "../repositories/OtpRepository.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const verifyGenericOtp = async (email, otp) => {
  const otpRecord = await OtpRepository.findByEmailAndOtp(email, otp);

  if (!otpRecord) {
    throw new Error("Invalid or expired OTP");
  }

  await OtpRepository.deleteByEmail(email);
  return true;
};

export const generateOtp = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// NodeMailer Transport
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
