import express from "express";
import auth from "../middlewares/auth.js";
import campaignController, { checkCampaignFullController } from "../controllers/UserController/campaignController.js";
import upload from "../middlewares/upload.js";
import { getCampaigns } from "../controllers/publicController/publicController.js";
import { getCampaignById } from "../controllers/UserController/campaignController.js";

const router = express.Router();

router.post(
  "/create",
  auth,
  upload.fields([
    { name: "orgProof", maxCount: 1 },
    { name: "campaignImage", maxCount: 1 },
    { name: "campaignDocs", maxCount: 1 },
  ]),
  campaignController.createCampaign
);

router.get("/campaignslist", getCampaigns);
router.get("/campaignslist/:id", getCampaignById);
router.get("/raisedAmount/:campaignId",auth, checkCampaignFullController)

export default router;
