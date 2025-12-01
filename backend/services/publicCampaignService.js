import { findPublicCampaigns , findPublicCampaignById } from "../repositories/CampaignRepository.js";


export const getPublicCampaigns = async () => {
  const campaigns = await findPublicCampaigns();
  return campaigns;
};


export const getSinglePublicCampaign = async (campaignId) => {
  const campaign = await findPublicCampaignById(campaignId);

   if (!campaign) {
    const error = new Error("Campaign not found");
    error.statusCode = 404;
    throw error;
  }

  return campaign;
};

