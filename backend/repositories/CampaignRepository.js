import Campaign from "../models/campaign.js";

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

export const getCampaignById = async (id) => {
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

 export const findPublicCampaigns = async () => {
  return Campaign.find({
   status: "Approved",      
    isDeleted: false   
  })
    .select("title image targetAmount createdAt") 
    .sort({ createdAt: -1 })
    .lean();
};

export const findPublicCampaignById = async (campaignId) => {
  return Campaign.findOne({
    _id: campaignId,
   status: "Approved",      
    isDeleted: false  
  })
    .select("-__v") 
    .lean();
};