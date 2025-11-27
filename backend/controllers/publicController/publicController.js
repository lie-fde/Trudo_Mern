
import { getPublicCampaigns ,getSinglePublicCampaign } from "../../services/publicCampaignService.js";

export const getCampaigns = async (req, res, next) => {
  try {
    const campaigns = await getPublicCampaigns();

    return res.status(200).json({
      success: true,
      campaigns,
    });
  } catch (error) {
    next(error); 
  }
};


export const getSingleCampaign = async (req, res, next) => {
  try {
    const { id } = req.params;

    const campaign = await getSinglePublicCampaign(id);

    return res.status(200).json({
      success: true,
      campaign,
    });
  } catch (error) {
    next(error);
  }
};