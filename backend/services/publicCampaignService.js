import {
  findPublicCampaigns,
  findPublicCampaignById,
} from "../repositories/CampaignRepository.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";

export const getPublicCampaigns = async (queryParams) => {
  return await findPublicCampaigns(queryParams);
};

export const getSinglePublicCampaign = async (campaignId) => {
  const campaign = await findPublicCampaignById(campaignId);

  if (!campaign) {
    const error = new Error("Campaign not found");
    error.statusCode = HTTP_STATUS.NOT_FOUND;
    throw error;
  }

  return campaign;
};
