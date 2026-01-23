import UserRepository from "../repositories/UserRepository.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const adminLogin = async (adminEmail, password) => {
  const admin = await UserRepository.findByEmail(adminEmail);

  if (!admin || !admin.isAdmin) throw new Error("Admin don't exist");

  const validPassword = await bcrypt.compare(password, admin.password);

  if (!validPassword) throw new Error("Invalid Password");

  const adminAccessToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "10hr",
  });
  const adminrefreshToken = jwt.sign(
    { id: admin._id },
    process.env.JWT_REFRESH_SECRET,
    {
      expiresIn: "2d",
    },
  );

  return {
    message: "Login Successful",
    adminAccessToken,
    adminrefreshToken,
    admin: {
      adminName: admin.userName,
      adminEmail: admin.userEmail,
    },
  };
};

const getAllUsers = async ({ search, page, limit }) => {
  return await UserRepository.findAllUsers({
    search,
    page,
    limit,
  });
};

const getUserById = async (id) => {
  if (!id) throw new Error("User id is required");

  const user = await UserRepository.findById(id);

  if (!user) throw new Error("User not found");

  return user;
};

const softDeleteUser = async (id) => {
  const user = await UserRepository.findById(id);

  if (!user) throw new Error("User not found");
  if (user.isDeleted) throw new Error("User already deleted");

  return await UserRepository.deleteUser(id);
};

const blockUser = async (id) => {
  const user = await UserRepository.findById(id);

  if (!user) throw new Error("User not found");
  if (user.isBlocked) throw new Error("User already blocked");

  return await UserRepository.blockUser(id);
};

const unblockUser = async (id) => {
  const user = await UserRepository.findById(id);

  if (!user) throw new Error("User not found");
  if (!user.isBlocked) throw new Error("User is not blocked");

  return await UserRepository.unblockUser(id);
};

const refreshAdminAccessToken = async (adminrefreshToken) => {
  if (!adminrefreshToken) throw new Error("Admin refresh token missing");

  const decoded = jwt.verify(adminrefreshToken, process.env.JWT_REFRESH_SECRET);

  if (!decoded.id) throw new Error("Invalid admin refresh token");

  const admin = await UserRepository.findById(decoded.id);
  if (!admin) throw new Error("Admin not found");

  if (!admin.isAdmin) throw new Error("Not authorized");

  const adminAccessToken = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
    expiresIn: "10hr",
  });

  return {
    adminAccessToken,
    admin: {
      adminName: admin.userName,
      adminEmail: admin.userEmail,
    },
  };
};

const updateAdminProfileService = async (userId, data, avatar) => {
  const updateData = {};

  // Map frontend → backend fields
  if (data.userName) updateData.userName = data.userName;
  if (data.mobileNumber) updateData.mobileNumber = data.mobileNumber;

  if (avatar) {
    updateData.avatar = avatar; // Cloudinary URL
  }

  const updatedUser = await UserRepository.updateUserProfileRepo(
    userId,
    updateData,
  );

  if (!updatedUser) throw new Error("User not found");

  return updatedUser;
};

export default {
  adminLogin,
  getAllUsers,
  getUserById,
  softDeleteUser,
  blockUser,
  unblockUser,
  refreshAdminAccessToken,
  updateAdminProfileService,
};
