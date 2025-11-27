import {
  createCampaignrepo,
  getPendingCampaigns,
  getCampaignById,
  updateStatus,
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
    User: req.user._id,

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

export const updateCampaignStatusService = async (id ,updateData) => {
  const valid = ["Approved", "Rejected"];
  const { status } = updateData;

  if (!valid.includes(status)) {
    throw new Error("Invalid status");
  }

  const updated = await updateStatus(id, updateData);

  if (!updated) throw new Error("Failed to update");

  return updated;
};
