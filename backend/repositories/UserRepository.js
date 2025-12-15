import User from "../models/User.js";

const create = async (data) => await User.create(data);

const findByEmail = async (userEmail) => await User.findOne({ userEmail });

const findById = async (id) => await User.findById(id);

const findByIdEvent = async (userId) => await User.findById(userId);

const updatePassword = async (email, hashedPassword) => {
  return await User.updateOne(
    { userEmail: email },
    { $set: { password: hashedPassword } }
  );
};

const findAllUsers = async () => {
  return await User.find({ isDeleted: false, isAdmin: false });
};

const blockUser = async (id) => {
  return await User.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
};

const unblockUser = async (id) => {
  return await User.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
};

const deleteUser = async (id) =>
  await User.findByIdAndUpdate(id, { isDeleted: true }, { new: true });

const getUsersPaginated = async (skip, limit) =>
  await User.find().skip(skip).limit(limit);

const countUsers = async () => await User.countDocuments();

const getUserProfileRepo = async (id) =>
  await User.findById(id).select("-password");

const updateUserEmailRepo = async (userId, newEmail) => {
  return await User.findByIdAndUpdate(
    userId,
    { userEmail: newEmail },
    { new: true }
  );
};

const updateUserProfileRepo = async (userId, updateData) => {
  return await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true }
  );
};



export default {
  create,
  findByEmail,
  findById,
  updatePassword,
  findAllUsers,
  blockUser,
  unblockUser,
  deleteUser,
  getUsersPaginated,
  countUsers,
  getUserProfileRepo,
  updateUserEmailRepo,
  updateUserProfileRepo,
  findByIdEvent
};
