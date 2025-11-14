import OtpRepository from "../repositories/OtpRepository.js";

export const verifyGenericOtp = async (email, otp) => {
  const otpRecord = await OtpRepository.findByEmailAndOtp(email, otp);

  if (!otpRecord) {
    throw new Error("Invalid or expired OTP");
  }

  await OtpRepository.deleteByEmail(email);
  return true;
};