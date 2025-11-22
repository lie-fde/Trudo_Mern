import CampaignService from "../../services/campaignService.js";

const createCampaign = async (req, res) => {
  try {
   
    const result = await CampaignService.createCampaign(req);

   
    return res.status(201).json({
      success: true,
      message: "Campaign created successfully",
      data: result,
    });
  } catch (err) {
    console.error("Campaign Create Error:", err.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create campaign",
      error: err.message,
    });
  }
};

export default {createCampaign,};
