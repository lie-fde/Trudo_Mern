import {
  getPublicCampaigns,
  getSinglePublicCampaign,
} from "../../services/publicCampaignService.js";
import { HTTP_STATUS } from "../../constants/httpStatusCodes.js";

export const getCampaigns = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 6,
      search = "",
      sort = "created_desc",
    } = req.query;

    const data = await getPublicCampaigns({
      page: Number(page),
      limit: Number(limit),
      search,
      sort,
    });

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      ...data,
    });
  } catch (error) {
    next(error);
  }
};

export const getSingleCampaign = async (req, res, next) => {
  try {
    const { id } = req.params;

    const campaign = await getSinglePublicCampaign(id);

    return res.status(HTTP_STATUS.OK).json({
      success: true,
      campaign,
    });
  } catch (error) {
    next(error);
  }
};
