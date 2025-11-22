import Campaign from "../models/campaign.js"

const createCampaign = async (data) => {
  return await Campaign.create(data);
};

const findCampaignById = async (id) => {
  return await Campaign.findById(id).populate("User");
};

const findAllCampaigns = async () => {
  return await Campaign.find().populate("User");
};

export default {createCampaign,findCampaignById,findAllCampaigns,};
