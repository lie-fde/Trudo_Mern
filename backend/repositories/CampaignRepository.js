import Campaign from "../models/campaign.js";
import Payment from "../models/Payment.js";
import DonationTransaction from "../models/DonationTransaction.js";
import mongoose from "mongoose";

export const createCampaignrepo = async (data) => await Campaign.create(data);

export const findCampaignById = async (id) =>
  await Campaign.findById(id).populate("User");

export const findAllCampaigns = async () =>
  await Campaign.find().populate("User");

export const getPendingCampaigns = async () => {
  return await Campaign.find({ status: "Pending", isDeleted: false }).populate(
    "User",
    "userName userEmail mobileNumber"
  );
};

export const 
getCampaignById = async (id) => {
  return await Campaign.findById(id).populate(
    "User",
    "userName userEmail mobileNumber"
  );
};

export const updateStatus = async (id, updateData) => {
  const { status, rejectionReason } = updateData;

  let updateFields = {
    status,
    approvalDate: status === "Approved" ? new Date() : null,
  };

  if (status === "Rejected" && rejectionReason) {
    updateFields.rejectionReason = rejectionReason;
  }

  return await Campaign.findByIdAndUpdate(id, updateFields, { new: true });
};

// export const findPublicCampaigns = async () => {
//   return Campaign.find({
//     status: "Approved",
//     isDeleted: false,
//     isBlocked: false,
//   })
//     .select("title image targetAmount createdAt")
//     .sort({ createdAt: -1 })
//     .lean();
// };


export const findPublicCampaigns = async ({ page, limit, search, sort }) => {
  const skip = (page - 1) * limit;

  // Sorting logic
  let sortQuery = {};
  switch (sort) {
    case "created_asc":
      sortQuery = { createdAt: 1 };
      break;
    case "created_desc":
      sortQuery = { createdAt: -1 };
      break;
    case "highest_raised":
      sortQuery = { raisedAmount: -1 };
      break;
    case "lowest_raised":
      sortQuery = { raisedAmount: 1 };
      break;
    default:
      sortQuery = { createdAt: -1 };
  }

  const matchStage = {
    status: "Approved",
    isDeleted: false,
    isBlocked: false,
  };

  if (search) {
    matchStage.title = { $regex: search, $options: "i" };
  }

  const data = await Campaign.aggregate([
    { $match: matchStage },

    // Lookup donation transactions
    {
      $lookup: {
        from: "donationtransactions",
        localField: "_id",
        foreignField: "CampaignId",
        as: "donations",
      },
    },

    // Lookup payments : donations.paymentId → payments._id
    {
      $lookup: {
        from: "payments",
        localField: "donations.paymentId",
        foreignField: "_id",
        as: "paymentDetails",
      },
    },

    // Calculate raisedAmount
    {
      $addFields: {
        raisedAmount: {
          $sum: {
            $map: {
              input: {
                $filter: {
                  input: { $ifNull: ["$paymentDetails", []] },
                  as: "p",
                  cond: { $eq: ["$$p.paymentStatus", "success"] },
                },
              },
              as: "p",
              in: "$$p.amount",
            },
          },
        },
      },
    },

    // Sort based on query
    { $sort: sortQuery },

    // Pagination
    { $skip: skip },
    { $limit: limit },

    // Select only required fields
    {
      $project: {
        title: 1,
        image: 1,
        targetAmount: 1,
        raisedAmount: 1,
        createdAt: 1,
      },
    },
  ]);

  // Get total count (without pagination)
  const total = await Campaign.countDocuments(matchStage);

  return {
    campaigns: data,
    total,
    totalPages: Math.ceil(total / limit),
  };
};



export const findPublicCampaignById = async (campaignId) => {
  return Campaign.findOne({
    _id: campaignId,
    status: "Approved",
    isDeleted: false,
  })
    .select("-__v")
    .lean();
};

export const findCampaignsAdmin = async () => {
  return Campaign.find({
    status: "Approved",
    isDeleted: false,
  })
    .select(
      "_id title image category status targetAmount isBlocked isDeleted createdAt"
    )
    .sort({ createdAt: -1 })
    .lean();
};

export const blockCampaignRepository = async (id) => {
  return await Campaign.findByIdAndUpdate(
    id,
    { isBlocked: true },
    { new: true }
  );
};

export const unblockCampaignRepository = async (id) => {
  return await Campaign.findByIdAndUpdate(
    id,
    { isBlocked: false },
    { new: true }
  );
};

export const deleteCampaignRepository = async (id) => {
  return await Campaign.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
};

export const updateCampaignRepo = async (id, updateData) => {
  return await Campaign.findByIdAndUpdate(id, updateData, { new: true });
};

export const getmMyCampaign = async (userId) => {
  return await Campaign.aggregate([
    {
      $match: { User: new mongoose.Types.ObjectId(userId) },
    },

    // Lookup donation transactions for each campaign
    {
      $lookup: {
        from: "donationtransactions",
        localField: "_id",
        foreignField: "CampaignId",
        as: "donations",
      },
    },

    // Lookup payments for each donation
    {
      $lookup: {
        from: "payments",
        localField: "donations.paymentId",
        foreignField: "_id",
        as: "paymentDetails",
      },
    },

    // Add raisedAmount by summing only successful payments
    {
      $addFields: {
        raisedAmount: {
          $sum: {
            $map: {
              input: {
                $filter: {
                  input: { $ifNull: ["$paymentDetails", []] },
                  as: "p",
                  cond: { $eq: ["$$p.paymentStatus", "success"] },
                },
              },
              as: "p",
              in: "$$p.amount",
            },
          },
        },
      },
    },

    // Hide donation & payment arrays from output
    {
      $project: {
        donations: 0,
        paymentDetails: 0,
      },
    },
  ]);
};


export const calculateRaisedAmountRepo = async (campaignId) => {
  const result = await Campaign.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(campaignId),
        status: "Approved",
        isDeleted: false,
        isBlocked: false,
      },
    },

    // 🔹 Get donation transactions
    {
      $lookup: {
        from: "donationtransactions",
        localField: "_id",
        foreignField: "CampaignId",
        as: "donations",
      },
    },

    // 🔹 Get payment details
    {
      $lookup: {
        from: "payments",
        localField: "donations.paymentId",
        foreignField: "_id",
        as: "paymentDetails",
      },
    },

    // 🔹 Calculate raisedAmount (ONLY successful payments)
    {
      $addFields: {
        raisedAmount: {
          $sum: {
            $map: {
              input: {
                $filter: {
                  input: { $ifNull: ["$paymentDetails", []] },
                  as: "p",
                  cond: { $eq: ["$$p.paymentStatus", "success"] },
                },
              },
              as: "p",
              in: "$$p.amount",
            },
          },
        },
      },
    },

    {
      $project: {
        raisedAmount: 1,
      },
    },
  ]);

  return result[0]?.raisedAmount || 0;
};
