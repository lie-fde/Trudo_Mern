import DonationTransaction from "../models/DonationTransaction.js";

// export const getMonthlyDonationGraphRepo = async () => {
//   return DonationTransaction.aggregate([
//     // Join payments
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

//     // Group by month
//     {
//       $group: {
//         _id: { $month: "$createdAt" },
//         amount: { $sum: "$payment.amount" },
//         count: { $sum: 1 },
//       },
//     },

//     // Sort Jan → Dec
//     {
//       $sort: { _id: 1 },
//     },
//   ]);
// };


export const getMonthlyDonationGraphRepo = async () => {
  return DonationTransaction.aggregate([
    {
      $lookup: {
        from: "payments",
        localField: "paymentId",
        foreignField: "_id",
        as: "payment",
      },
    },
    { $unwind: "$payment" },

    {
      $match: {
        "payment.paymentStatus": "success",
      },
    },

    // ✅ Group by YEAR + MONTH
    {
      $group: {
        _id: {
          year: { $year: "$createdAt" },
          month: { $month: "$createdAt" },
        },
        amount: { $sum: "$payment.amount" },
        count: { $sum: 1 },
      },
    },

    {
      $sort: {
        "_id.year": 1,
        "_id.month": 1,
      },
    },
  ]);
};
