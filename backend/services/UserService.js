import bcrypt from "bcrypt";
import UserRepository from "../repositories/UserRepository.js";
import OtpRepository from "../repositories/OtpRepository.js";
import { verifyGenericOtp } from "../utils/otpHelper.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { randomInt } from "crypto";
import nodeMailer from "nodemailer";
import { generateOtp, transporter } from "../utils/otpHelper.js";

dotenv.config({ path: "../.env" });

const signup = async (userData) => {
  const existingUser = await UserRepository.findByEmail(userData.userEmail);
  if (existingUser) throw new Error("Email already Exist");
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const newUser = await UserRepository.create({
    ...userData,
    password: hashedPassword,
    isVerified: false,
  });

  const otpCode = randomInt(100000, 999999).toString();

  await OtpRepository.create({
    email: userData.userEmail,
    otp: otpCode,
  });

  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: userData.userEmail,
    subject: "Verify Your Email",
    text: `Your OTP is ${otpCode}. It expires in 5 minutes.`,
  });

  return { message: "OTP sent to email", userId: newUser._id };
};

const verifyOtp = async (email, otp) => {
  const otpRecord = await OtpRepository.findByEmailAndOtp(email, otp);

  await verifyGenericOtp(email, otp);

  const user = await UserRepository.findByEmail(email);
  if (!user) throw new Error("User Not Found");

  user.isVerified = true;
  await user.save();

  return { message: "Account verified successfully" };
};

const resendOtp = async (email) => {
  const user = await UserRepository.findByEmail(email);

  if (!user) throw new Error("User not found");

  if (user.isVerified) throw new Error("User already Verified");

  await OtpRepository.deleteByEmail(email);

  const otpCode = randomInt(100000, 999999).toString();

  await OtpRepository.create({
    email,
    otp: otpCode,
  });

  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    text: `Your OTP is ${otpCode}. It expires in 5 minutes.`,
  });

  return { message: "New OTP sent successfully" };
};

const resendPasswordOtp = async (email) => {
  const user = await UserRepository.findByEmail(email);

  if (!user) throw new Error("User not found");

  await OtpRepository.deleteByEmail(email);

  const otpCode = randomInt(100000, 999999).toString();

  await OtpRepository.create({
    email,
    otp: otpCode,
  });

  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email",
    text: `Your OTP is ${otpCode}. It expires in 5 minutes.`,
  });

  return { message: "New OTP sent successfully" };
};

const login = async (userEmail, password) => {
  const user = await UserRepository.findByEmail(userEmail);
  if (!user || !user.isVerified) throw new Error("User don't exist!");

  if (user.isDeleted) throw new Error("Your account has been deleted.");

  if (user.isBlocked) throw new Error("Your account has been blocked");

  if (user.isAdmin) throw new Error("Admins cannot log in here.");

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) throw new Error("Invalid Password");

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1hr",
  });

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "2d",
    }
  );

  return {
    accessToken,
    refreshToken,
    user: {
      userName: user.userName,
      userEmail: user.userEmail,
      mobileNumber: user.mobileNumber,
      isBlocked : user.isBlocked
    },
  };
};

const resetPassword = async (email, newPassword) => {
  const user = await UserRepository.findByEmail(email);
  if (!user) throw new Error("User not found");

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await UserRepository.updatePassword(email, hashedPassword);

  return { message: "Password reset successfully" };
};

const forgotPassword = async (email) => {
  const user = await UserRepository.findByEmail(email);
  if (!user) throw new Error("User not found");

  const otpCode = randomInt(100000, 999999).toString();

  await OtpRepository.deleteByEmail(email);

  await OtpRepository.saveOtp(email, otpCode);

  const transporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is ${otpCode}. It expires in 5 minutes.`,
  });

  return { message: "OTP sent to email for password reset" };
};

const verifyPasswordOtp = async (email, otp) => {
  await verifyGenericOtp(email, otp);

  return { message: "OTP verified successfully" };
};

const googleLoginService = async (googleUser) => {
  let user = await UserRepository.findByEmail(googleUser.userEmail);

  if (user && !user.googleId) {
    user.googleId = googleUser.googleId;
    user.avatar = googleUser.avatar || user.avatar;
    await user.save();
  }

  if (!user) {
    user = await UserRepository.create({
      googleId: googleUser.googleId,
      userName: googleUser.userName,
      userEmail: googleUser.userEmail,
      avatar: googleUser.avatar,
    });
  }

  const accessToken = jwt.sign({ id: user._id , role : "user"}, process.env.JWT_SECRET, {
    expiresIn: "1hr",
  });

  const refreshToken = jwt.sign(
    { id: user._id , role : "user"},
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "2d",
    }
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user._id,
      name: user.userName,
      email: user.userEmail,
      avatar: user.avatar,
    },
  };
};

const getAllUsersPaginated = async (page, limit) => {
  const skip = (page - 1) * limit;
  const users = await UserRepository.getUsersPaginated(skip, limit);
  const total = await UserRepository.countUsers();

  return {
    users,
    page,
    total,
    totalPage: Math.floor(total / limit),
  };
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) throw new Error("Refresh token missing");

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  if (!decoded.id) throw new Error("Invalid refresh token");

  const user = await UserRepository.findById(decoded.id);
  if (!user) throw new Error("User not found");

  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1hr",
  });

  return { accessToken, userName: user.userName, userEmail: user.userEmail };
};

const getMeUser = async (id) => {
  const user = await UserRepository.findById(id);
  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const getUserProfileService = async (id) => {
  const user = await UserRepository.getUserProfileRepo(id);

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

const sendOtpServiceProfile = async (email) => {
  const otp = generateOtp();

  // Save OTP
  await OtpRepository.saveOtp(email, otp);

  // Send email
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Change OTP Verification",
    html: `
      <h3>Your OTP Code</h3>
      <p style="font-size: 22px; font-weight: bold;">${otp}</p>
      <p>This OTP is valid for 5 minutes.</p>
    `,
  });

  return { message: "OTP sent successfully" };
};

const verifyOtpServiceProfile = async (userId, newEmail, otp) => {
  // 1️⃣ Find OTP record
  const record = await OtpRepository.findByEmailAndOtp(newEmail, otp);
  if (!record) throw new Error("OTP expired or not found");

  // 3️⃣ Check email exists already
  const existing = await UserRepository.findByEmail(newEmail);
  if (existing) throw new Error("Email already in use");

  // 4️⃣ Update user email
  const updatedUser = await UserRepository.updateUserEmailRepo(
    userId,
    newEmail
  );
  if (!updatedUser) throw new Error("User not found");

  // 5️⃣ Delete OTP entry after success
  await OtpRepository.deleteByEmail(newEmail);

  return {
    message: "Email updated successfully",
    user: updatedUser,
  };
};

const updateUserProfileService = async (userId, data, avatar) => {
  if (data.email) {
    throw new Error("Email cannot be updated without OTP verification");
  }

  const updateData = {};

  if (data.address && typeof data.address === "string") {
    data.address = JSON.parse(data.address);
  }

  // Map frontend → backend fields
  if (data.userName) updateData.userName = data.userName;
  if (data.mobileNumber) updateData.mobileNumber = data.mobileNumber;
  if (data.gender) updateData.gender = data.gender;
  if (data.dateOfBirth) updateData.dateOfBirth = data.dateOfBirth;

  // Address handling (your schema uses nested object)
  updateData.address = {
    address: data.address.address || "",
    street: data.address.street || "",
    city: data.address.city || "",
    state: data.address.state || "",
    pincode: data.address.pincode || "",
    country: data.address.country || "India",
  };

  if (avatar) {
    updateData.avatar = avatar; // Cloudinary URL
  }

  const updatedUser = await UserRepository.updateUserProfileRepo(
    userId,
    updateData
  );

  if (!updatedUser) throw new Error("User not found");

  return updatedUser;
};


 const changePasswordService = async (
  userId,
  currentPassword,
  newPassword
) => {
  const id=userId
  const user = await UserRepository.findById(id);
  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) throw new Error("Current password is incorrect");

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await UserRepository.updateUserPassword(id, hashedPassword);
};

export default {
  signup,
  login,
  verifyOtp,
  resendOtp,
  resendPasswordOtp,
  resetPassword,
  forgotPassword,
  verifyPasswordOtp,
  googleLoginService,
  getAllUsersPaginated,
  getMeUser,
  refreshAccessToken,
  getUserProfileService,
  sendOtpServiceProfile,
  verifyOtpServiceProfile,
  updateUserProfileService,
  changePasswordService
};
