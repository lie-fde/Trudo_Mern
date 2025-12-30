import DonationTransaction from "../models/DonationTransaction.js";

export const getMonthlyDonationGraphRepo = async () => {
  return DonationTransaction.aggregate([
    // Join payments
    {
      $lookup: {
        from: "payments",
        localField: "paymentId",
        foreignField: "_id",
        as: "payment",
      },
    },
    { $unwind: "$payment" },

    // Only successful payments
    {
      $match: {
        "payment.paymentStatus": "success",
      },
    },

    // Group by month
    {
      $group: {
        _id: { $month: "$createdAt" },
        amount: { $sum: "$payment.amount" },
        count: { $sum: 1 },
      },
    },

    // Sort Jan → Dec
    {
      $sort: { _id: 1 },
    },
  ]);
};
