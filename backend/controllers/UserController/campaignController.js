import {
  createCampaignService,
  getPendingRequests,
  getCampaignDetailsrepo,
  updateCampaignStatusService,
  getUserCampaignsService,
} from "../../services/campaignService.js";

const createCampaign = async (req, res) => {
  try {
    const result = await createCampaignService(req);

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

export default { createCampaign };

export const getPendingCampaigns = async (req, res) => {
  try {
    const campaigns = await getPendingRequests();
    return res.status(200).json({ success: true, campaigns });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const getCampaignById = async (req, res) => {
  try {
    const campaign = await getCampaignDetailsrepo(req.params.id);
    return res.status(200).json({ success: true, campaign });
  } catch (err) {
    return res.status(404).json({ success: false, message: err.message });
  }
};

export const updateCampaignStatus = async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    let updateData = { status };

    if (status === "Rejected" && rejectionReason) {
      updateData.rejectionReason = rejectionReason;
    }

    const updatedCampaign = await updateCampaignStatusService(
      req.params.id,
      updateData
    );

    return res.status(200).json({
      success: true,
      message: `Campaign ${status} successfully`,
      updatedCampaign,
    });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

export const getUserCampaignsController = async (req, res) => {
  try {
    const userId = req.user._id;

    const campaigns = await getUserCampaignsService(userId);

    return res.status(200).json({
      success: true,
      data: campaigns,
    });
  } catch (err) {
    console.error("Error fetching user campaigns:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch campaigns",
    });
  }
};
