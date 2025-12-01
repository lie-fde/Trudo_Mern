import {
  createCampaignrepo,
  getPendingCampaigns,
  getCampaignById,
  updateStatus,
  findCampaignsAdmin,
  findCampaignById,
  blockCampaignRepository,
  unblockCampaignRepository,
  deleteCampaignRepository,
  updateCampaignRepo,
  getmMyCampaign,
} from "../repositories/CampaignRepository.js";

export const createCampaignService = async (req) => {
  const {
    organizationName,
    title,
    description,
    category,
    location,
    targetAmount,
    bankAcc,
    IFSCCode,
    beneficiaryName,
  } = req.body;

  const orgProof = req.files?.orgProof?.map((file) => file.path) || [];
  const campaignImage =
    req.files?.campaignImage?.map((file) => file.path) || [];
  const campaignDocs = req.files?.campaignDocs?.map((file) => file.path) || [];

  const campaignData = {
    User: req.user?._id || req.admin._id,

    organizationName: organizationName || null,
    organizationIDProof: orgProof,

    title,
    description,
    category,
    location,
    image: campaignImage,
    beneficiary: beneficiaryName,
    beneficiaryDocuments: campaignDocs,

    bankDetails: {
      accountNumber: bankAcc,
      IFSCCode,
    },

    targetAmount,
  };

  return await createCampaignrepo(campaignData);
};

export const getPendingRequests = async () => {
  return await getPendingCampaigns();
};

export const getCampaignDetailsrepo = async (campaignId) => {
  const campaign = await getCampaignById(campaignId);
  if (!campaign) throw new Error("Campaign not found");
  return campaign;
};

export const updateCampaignStatusService = async (id, updateData) => {
  const valid = ["Approved", "Rejected"];
  const { status } = updateData;

  if (!valid.includes(status)) {
    throw new Error("Invalid status");
  }

  const updated = await updateStatus(id, updateData);

  if (!updated) throw new Error("Failed to update");

  return updated;
};

export const getCampaignsAdmin = async () => {
  const campaigns = await findCampaignsAdmin();
  return campaigns;
};

export const blockCampaignService = async (id) => {
  const campaign = await findCampaignById(id);

  if (!campaign) throw new Error("Campaign not found");
  if (campaign.isBlocked) throw new Error("Campaign already blocked");

  return await blockCampaignRepository(id);
};

export const unblockCampaignService = async (id) => {
  const campaign = await findCampaignById(id);

  if (!campaign) throw new Error("Campaign not found");
  if (!campaign.isBlocked) throw new Error("Campaign already unblocked");

  return await unblockCampaignRepository(id);
};

export const deleteCampaignService = async (id) => {
  const campaign = await findCampaignById(id);

  if (!campaign) throw new Error("Campaign not found");
  if (campaign.isDeleted) throw new Error("Campaign already deleted");

  return await deleteCampaignRepository(id);
};

export const updateCampaignService = async (id, data) => {
  const campaign = await findCampaignById(id);

  if (!campaign) throw new Error("Campaign not found");

  const orgProof = data.files?.orgProof?.map((file) => file.path) || [];
  const campaignImage =
    data.files?.campaignImage?.map((file) => file.path) || [];
  const campaignDocs = data.files?.campaignDocs?.map((file) => file.path) || [];

  const updateData = {
    title: data.title,
    description: data.description,
    category: data.category,
    location: data.location,
    targetAmount: data.targetAmount,
    beneficiary: data.beneficiary,
    organizationName: data.organizationName,
    bankDetails: {
      accountNumber: data.bankAcc,
      IFSCCode: data.IFSCCode,
    },
  };

  if (orgProof.length > 0) updateData.organizationIDProof = orgProof;
  if (campaignImage.length > 0) updateData.image = campaignImage;
  if (campaignDocs.length > 0) updateData.beneficiaryDocuments = campaignDocs;

  return await updateCampaignRepo(id, updateData);
};

export const getUserCampaignsService = async (userId) => {
  const campaigns = await getmMyCampaign(userId);

 if (!campaigns) {
    return []; 
}

  return campaigns;
};