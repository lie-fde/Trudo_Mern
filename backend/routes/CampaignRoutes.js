import express from 'express'
import auth from '../middlewares/auth.js'
import campaignController from '../controllers/UserController/campaignController.js'
import upload from '../middlewares/upload.js'
import { getCampaigns,getSingleCampaign } from '../controllers/publicController/publicController.js'


const router = express.Router()

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
router.get("/campaignslist/:id",getSingleCampaign);



export default router