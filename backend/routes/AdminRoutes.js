import express from "express";
import {
  fetchAllUsers,
  fetchUser,
  softDelete,
  block,
  unblock,
} from "../controllers/AdminController/AdminController.js";
import {
  getPendingCampaigns,
  getCampaignById,
  updateCampaignStatus,
} from "../controllers/UserController/campaignController.js";
import adminAuth from "../middlewares/adminAuth.js";

const router = express.Router();

router.get("/users", adminAuth,fetchAllUsers);

router.get("/users/:id", adminAuth,fetchUser);

router.patch("/users/delete/:id",adminAuth, softDelete);

router.patch("/users/block/:id", adminAuth,block);

router.patch("/users/unblock/:id",adminAuth, unblock);

router.get("/campaigns/pending", adminAuth, getPendingCampaigns);

router.get("/campaigns/:id", adminAuth, getCampaignById);

router.patch("/campaigns/:id/status", adminAuth, updateCampaignStatus);

export default router;
