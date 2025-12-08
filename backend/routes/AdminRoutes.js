import express from "express";
import {
  fetchAllUsers,
  fetchUser,
  softDelete,
  block,
  unblock,
  getCampaignsAdminController,
  blockCampaignController,
  unblockCampaignController,
  deleteCampaignController,
  updateCampaignController,
  updateAdminProfileController,
} from "../controllers/AdminController/AdminController.js";
import {
  getPendingCampaigns,
  getCampaignById,
  updateCampaignStatus,
} from "../controllers/UserController/campaignController.js";
import adminAuth from "../middlewares/adminAuth.js";
import campaignController from "../controllers/UserController/campaignController.js";
import upload from "../middlewares/upload.js";
import profileUpload from "../middlewares/profileUpload.js";
import { getUserProfileController } from "../controllers/UserController/UserController.js";
import {
  getAdminDonationReportController,
  exportAdminDonationReportController,
  getDonationReportStats
} from "../controllers/AdminDonationController.js";

const router = express.Router();

router.get("/users", adminAuth, fetchAllUsers);

router.get("/users/:id", adminAuth, fetchUser);

router.patch("/users/delete/:id", adminAuth, softDelete);

router.patch("/users/block/:id", adminAuth, block);

router.patch("/users/unblock/:id", adminAuth, unblock);

router.get("/campaigns/pending", adminAuth, getPendingCampaigns);

router.get("/campaigns/:id", adminAuth, getCampaignById);

router.get("/campaigns", adminAuth, getCampaignsAdminController);

router.patch("/campaigns/:id/status", adminAuth, updateCampaignStatus);

router.patch("/campaign/block/:id", adminAuth, blockCampaignController);

router.patch("/campaign/unblock/:id", adminAuth, unblockCampaignController);

router.patch("/campaign/delete/:id", adminAuth, deleteCampaignController);

router.patch(
  "/campaign/update/:id",
  adminAuth,
  (req, res, next) => {
    upload.fields([
      { name: "orgProof", maxCount: 1 },
      { name: "campaignImage", maxCount: 1 },
      { name: "campaignDocs", maxCount: 1 },
    ])(req, res, (err) => {
      if (err) {
        console.error("MULTER ERROR:", err);
        return res
          .status(400)
          .json({ message: "Upload failed", error: err.message });
      }
      next();
    });
  },
  updateCampaignController
);

router.post(
  "/campaigns/create",
  adminAuth,
  (req, res, next) => {
    upload.fields([
      { name: "orgProof", maxCount: 1 },
      { name: "campaignImage", maxCount: 1 },
      { name: "campaignDocs", maxCount: 1 },
    ])(req, res, (err) => {
      if (err) {
        console.error("MULTER ERROR:", err);
        return res
          .status(400)
          .json({ message: "Upload failed", error: err.message });
      }
      next();
    });
  },
  campaignController.createCampaign
);

router.get("/profile", adminAuth, getUserProfileController);

router.put(
  "/profile/update",
  adminAuth,
  profileUpload.single("avatar"),
  updateAdminProfileController
);

router.get("/donations/report", adminAuth, getAdminDonationReportController);

router.get(
  "/donations/report/export",
  adminAuth,
  exportAdminDonationReportController
);


router.get("/donations/report/stats", adminAuth,getDonationReportStats);

export default router;
