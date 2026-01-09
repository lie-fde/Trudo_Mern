import User from "../models/User.js";
import DonationTransaction from "../models/DonationTransaction.js";

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

// const findAllUsers = async () => {
//   return await User.find({ isDeleted: false, isAdmin: false });
// };

// const findAllUsers = async () => {
//   return await DonationTransaction.aggregate([
//     // Join Payment
//     {
//       $lookup: {
//         from: "payments",
//         localField: "paymentId",
//         foreignField: "_id",
//         as: "payment",
//       },
//     },
//     { $unwind: "$payment" },

//     // Only successful payments
//     {
//       $match: {
//         "payment.paymentStatus": "success",
//       },
//     },

//     // Group by User
//     {
//       $group: {
//         _id: "$UserId",
//         totalDonations: { $sum: 1 },
//         totalAmountDonated: { $sum: "$payment.amount" },
//       },
//     },

//     // Join User details
//     {
//       $lookup: {
//         from: "users",
//         localField: "_id",
//         foreignField: "_id",
//         as: "user",
//       },
//     },
//     { $unwind: "$user" },

//     // Shape output
//     {
//       $project: {
//         _id: 0,
//         _id: "$user._id",
//         userName: "$user.userName",
//         userEmail: "$user.userEmail",
//         mobileNumber:"$user.mobileNumber",
//         totalDonations: 1,
//         totalAmountDonated: 1,
//       },
//     },
//   ]);
// };

const findAllUsers = async () => {
  return await User.aggregate([
    // 1️⃣ Only active non-admin users
    {
      $match: {
        isDeleted: false,
        isAdmin: false,
      },
    },

    // 2️⃣ Join Donation Transactions
    {
      $lookup: {
        from: "donationtransactions",
        localField: "_id",
        foreignField: "UserId",
        as: "donations",
      },
    },

    // 3️⃣ Join successful Payments
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

    // 4️⃣ Calculate totals
    {
      $addFields: {
        totalDonations: { $size: "$successfulPayments" },
        totalAmountDonated: {
          $ifNull: [{ $sum: "$successfulPayments.amount" }, 0],
        },
      },
    },

    // 5️⃣ Final response shape
    {
      $project: {
        _id: 1,
        userName: 1,
        userEmail: 1,          // ✅ from User
        mobileNumber: 1,   // ✅ from User
        totalDonations: 1,
        totalAmountDonated: 1,
      },
    },
  ]);
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
  updateUserPassword
};
