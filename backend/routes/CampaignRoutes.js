import express from 'express'
import auth from '../middlewares/auth.js'
import campaignController from '../controllers/UserController/campaignController.js'
import upload from '../middlewares/upload.js'


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

export default router