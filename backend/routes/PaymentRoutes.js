import express from "express";
import {
  createOrder,
  verifyPayment,
  getReceipt,
} from "../controllers/paymentController.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

router.post("/create-order", auth, createOrder);
router.post("/verify-payment", auth, verifyPayment);
router.get("/receipt/:receiptId", auth, getReceipt);

export default router;
