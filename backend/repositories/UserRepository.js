import User from "../models/User.js";
import DonationTransaction from "../models/DonationTransaction.js";

const create = async (data) => await User.create(data);

const findByEmail = async (userEmail) => await User.findOne({ userEmail });

const findById = async (id) => await User.findById(id);

const findByIdEvent = async (userId) => await User.findById(userId);

const updatePassword = async (email, hashedPassword) => {
  return await User.updateOne(
    { userEmail: email },
    { $set: { password: hashedPassword } },
  );
};

const findAllUsers = async ({ search, page, limit }) => {
  const matchStage = {
    isDeleted: false,
    isAdmin: false,
  };

  // 🔍 Backend search (username / email / mobile)
  if (search) {
    matchStage.$or = [
      { userName: { $regex: search, $options: "i" } },
      { userEmail: { $regex: search, $options: "i" } },
      { mobileNumber: { $regex: search, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;

  const pipeline = [
    { $match: matchStage },

    // Join Donation Transactions
    {
      $lookup: {
        from: "donationtransactions",
        localField: "_id",
        foreignField: "UserId",
        as: "donations",
      },
    },

    // Join successful Payments
    {
      $lookup: {
        from: "payments",
        let: { paymentIds: "$donations.paymentId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $in: ["$_id", "$$paymentIds"] },
                  { $eq: ["$paymentStatus", "success"] },
                ],
              },
            },
          },
        ],
        as: "successfulPayments",
      },
    },

    // Calculate totals
    {
      $addFields: {
        totalDonations: { $size: "$successfulPayments" },
        totalAmountDonated: {
          $ifNull: [{ $sum: "$successfulPayments.amount" }, 0],
        },
      },
    },

    // Sort latest users
    { $sort: { createdAt: -1 } },

    // Pagination
    { $skip: skip },
    { $limit: limit },

    // Final shape
    {
      $project: {
        _id: 1,
        userName: 1,
        userEmail: 1,
        mobileNumber: 1,
        totalDonations: 1,
        totalAmountDonated: 1,
        isBlocked: 1,
      },
    },
  ];

  const [users, totalDocs] = await Promise.all([
    User.aggregate(pipeline),
    User.countDocuments(matchStage),
  ]);

  return {
    users,
    totalDocs,
    totalPages: Math.ceil(totalDocs / limit),
    currentPage: page,
  };
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
    { new: true },
  );
};

const updateUserProfileRepo = async (userId, updateData) => {
  return await User.findByIdAndUpdate(
    userId,
    { $set: updateData },
    { new: true },
  );
};

const updateUserPassword = (id, password) => {
  return User.findByIdAndUpdate(id, { password });
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
  findByIdEvent,
  updateUserPassword,
};
