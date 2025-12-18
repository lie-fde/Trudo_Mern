import express from "express";
import {
  adminLogin,
  adminLogoutController,
  adminRefreshTokenController,
} from "../controllers/AdminController/AdminController.js";

const router = express.Router();

router.post("/login", adminLogin);

router.post("/logout", adminLogoutController);

router.get("/refresh-token", adminRefreshTokenController);

export default router;
