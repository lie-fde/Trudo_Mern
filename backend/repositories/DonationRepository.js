import DonationTransaction from "../models/DonationTransaction.js";
import campaign from "../models/campaign.js";
import User from "../models/User.js";
import mongoose from "mongoose";
import Payment from "../models/Payment.js";

const buildSearchStage = (searchQuery) => {
  if (!searchQuery) return {};

  return {
    $or: [
      { "campaign.title": { $regex: searchQuery, $options: "i" } },
      { "creator.userName": { $regex: searchQuery, $options: "i" } },
    ],
  };
};

const buildMatchStage = (userId) => ({
  UserId: new mongoose.Types.ObjectId(userId),
});

export const findDonationsPaginated = async (
  userId,
  skip,
  limit,
  searchQuery
) => {
  const matchStage = buildMatchStage(userId);
  const searchStage = buildSearchStage(searchQuery);

  const pipeline = [
    { $match: matchStage },

    {
      $lookup: {
        from: "campaigns",
        localField: "CampaignId",
        foreignField: "_id",
        as: "campaign",
      },
    },
    { $unwind: "$campaign" },

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
      $lookup: {
        from: "users",
        localField: "campaign.User",
        foreignField: "_id",
        as: "creator",
      },
    },
    { $unwind: "$creator" },

    { $match: searchStage },

    { $sort: { createdAt: -1 } },

    { $skip: skip },
    { $limit: limit },

    {
      $project: {
        id: "$_id",
        event: "$campaign.title",
        createdBy: "$creator.userName",
        date: "$createdAt",
        amount: "$payment.amount",
        method: "Razorpay",
        transactionId: "$payment.razorpayPaymentId",
        status: "$payment.paymentStatus",
        receiptId: 1,
        receiptUrl: 1,
      },
    },
  ];

  return DonationTransaction.aggregate(pipeline);
};

export const countDonations = async (userId, searchQuery) => {
  const matchStage = buildMatchStage(userId);
  const searchStage = buildSearchStage(searchQuery);

  const pipeline = [
    { $match: matchStage },

    // JOIN campaign
    {
      $lookup: {
        from: "campaigns",
        localField: "CampaignId",
        foreignField: "_id",
        as: "campaign",
      },
    },
    { $unwind: "$campaign" },

    // JOIN creator
    {
      $lookup: {
        from: "users",
        localField: "campaign.User",
        foreignField: "_id",
        as: "creator",
      },
    },
    { $unwind: "$creator" },

    // Apply search
    { $match: searchStage },

    // Count
    { $count: "total" },
  ];

  const result = await DonationTransaction.aggregate(pipeline);
  return result[0]?.total || 0;
};

export const DonationRepository = {
  getDonationStats: async (userId) => {
    const uid = new mongoose.Types.ObjectId(userId);

    const [totalDonations, sumResult, latest] = await Promise.all([
      DonationTransaction.countDocuments({ UserId: uid }),

      DonationTransaction.aggregate([
        { $match: { UserId: uid } },
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
          $group: {
            _id: null,
            totalAmount: { $sum: "$payment.amount" },
          },
        },
      ]),

      DonationTransaction.findOne({ UserId: uid })
        .sort({ createdAt: -1 })
        .select("createdAt"),
    ]);

    return {
      totalDonations,
      totalAmount: sumResult[0]?.totalAmount || 0,
      latestDonation: latest?.createdAt || null,
    };
  },
};

/**
 * -------------------------------
 * ADMIN DONATION REPORT (PAGINATED)
 * -------------------------------
 */
export const getAdminDonations = async ({
  skip,
  limit,
  search,
  campaignTitle,
  from,
  to,
}) => {
  const andConditions = [];

  // Date filtering (DonationTransaction.createdAt)
  if (from || to) {
    const createdAt = {};
    if (from) createdAt.$gte = from;
    if (to) createdAt.$lte = to;
    andConditions.push({ createdAt });
  }

  const pipeline = [
    ...(andConditions.length ? [{ $match: { $and: andConditions } }] : []),

    // JOIN Campaign
    {
      $lookup: {
        from: "campaigns",
        localField: "CampaignId",
        foreignField: "_id",
        as: "campaign",
      },
    },
    { $unwind: "$campaign" },

    // JOIN Payment
    {
      $lookup: {
        from: "payments",
        localField: "paymentId",
        foreignField: "_id",
        as: "payment",
      },
    },
    { $unwind: "$payment" },

    // JOIN User (donor)
    {
      $lookup: {
        from: "users",
        localField: "UserId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
  ];

  const postMatchAnd = [];

  // Search filter (campaign title + userName + email)
  if (search) {
    postMatchAnd.push({
      $or: [
        { "campaign.title": { $regex: search, $options: "i" } },
        { "user.userName": { $regex: search, $options: "i" } },
        { "payment.email": { $regex: search, $options: "i" } },
      ],
    });
  }

  // Campaign dropdown filter
  if (campaignTitle) {
    postMatchAnd.push({
      "campaign.title": { $regex: campaignTitle, $options: "i" },
    });
  }

  if (postMatchAnd.length) {
    pipeline.push({ $match: { $and: postMatchAnd } });
  }

  // Sort newest first
  pipeline.push({ $sort: { createdAt: -1 } });

  // Pagination + total count
  pipeline.push({
    $facet: {
      data: [
        { $skip: skip },
        { $limit: limit },
        {
          $project: {
            _id: 0,
            campaignId: "$campaign._id",
            campaignName: "$campaign.title",
            userEmail: "$payment.email",
            userName: "$user.userName",
            date: "$createdAt",
            amount: "$payment.amount",
            receiptId: 1,
            paymentId: 1,
          },
        },
      ],
      totalCount: [{ $count: "count" }],
    },
  });

  const result = await DonationTransaction.aggregate(pipeline);
  const data = result?.[0]?.data || [];
  const total = result?.[0]?.totalCount?.[0]?.count || 0;

  return { data, total };
};

/**
 * -------------------------------
 * ADMIN EXPORT REPORT (NO PAGINATION)
 * -------------------------------
 */
export const exportAdminDonations = async ({
  search,
  campaignTitle,
  from,
  to,
}) => {
  const andConditions = [];

  if (from || to) {
    const createdAt = {};
    if (from) createdAt.$gte = from;
    if (to) createdAt.$lte = to;
    andConditions.push({ createdAt });
  }

  const pipeline = [
    ...(andConditions.length ? [{ $match: { $and: andConditions } }] : []),

    {
      $lookup: {
        from: "campaigns",
        localField: "CampaignId",
        foreignField: "_id",
        as: "campaign",
      },
    },
    { $unwind: "$campaign" },

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
      $lookup: {
        from: "users",
        localField: "UserId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
  ];

  const postMatchAnd = [];

  if (search) {
    postMatchAnd.push({
      $or: [
        { "campaign.title": { $regex: search, $options: "i" } },
        { "user.userName": { $regex: search, $options: "i" } },
        { "payment.email": { $regex: search, $options: "i" } },
      ],
    });
  }

  if (campaignTitle) {
    postMatchAnd.push({
      "campaign.title": { $regex: campaignTitle, $options: "i" },
    });
  }

  if (postMatchAnd.length) {
    pipeline.push({ $match: { $and: postMatchAnd } });
  }

  pipeline.push({ $sort: { createdAt: -1 } });

  pipeline.push({
    $project: {
      _id: 0,
      campaignId: "$campaign._id",
      campaignName: "$campaign.title",
      userEmail: "$payment.email",
      userName: "$user.userName",
      date: "$createdAt",
      amount: "$payment.amount",
      receiptId: 1,
      paymentId: 1,
    },
  });

  return DonationTransaction.aggregate(pipeline);
};

export const DonationReportStatsRepo = async () => {
  const [TotalUsers, TotalCampaigns, totalDonationAgg, ActiveCampaigns] =
    await Promise.all([
      User.countDocuments(),
      campaign.countDocuments(),

      DonationTransaction.aggregate([
        {
          $lookup: {
            from: "payments",
            localField: "paymentId",
            foreignField: "_id",
            as: "payment",
          },
        },
        {
          $unwind: {
            path: "$payment",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$payment.amount" },
          },
        },
      ]),

      campaign.countDocuments({ status: "Approved" }),
    ]);

  const totalDonations = totalDonationAgg?.[0]?.totalAmount || 0;

  return {
    TotalUsers,
    TotalCampaigns,
    totalDonations,
    ActiveCampaigns,
  };
};
