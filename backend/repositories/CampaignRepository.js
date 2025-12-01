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
    isDeleted: false,
    isBlocked:false,   
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

 export const findCampaignsAdmin = async () => {
  return Campaign.find({
   status: "Approved",      
    isDeleted: false ,  
  })
    .select("_id title image category status targetAmount isBlocked isDeleted createdAt") 
    .sort({ createdAt: -1 })
    .lean();
};

export const blockCampaignRepository = async (id) =>{
  return await Campaign.findByIdAndUpdate(id,{isBlocked:true},{new:true})
}

export const unblockCampaignRepository = async (id)=>{
  return await Campaign.findByIdAndUpdate(id,{isBlocked:false},{new:true})
}

export const deleteCampaignRepository = async (id)=>{
  return await Campaign.findByIdAndUpdate(id,{isDeleted:true},{new:true})
}


export const updateCampaignRepo = async (id,updateData) =>{

  return await Campaign.findByIdAndUpdate(id, updateData,{new:true})
  
}

export const getmMyCampaign = async (userId) =>{
  return await Campaign.find({ User: userId }).populate("User");
}