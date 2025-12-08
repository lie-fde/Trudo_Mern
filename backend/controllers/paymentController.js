import { razorpayInstance } from "../config/razorpay.js";
import Payment from "../models/Payment.js";
import DonationTransaction from "../models/DonationTransaction.js";
import crypto from "crypto";
import { getReceiptService } from "../services/paymentService.js";
import UserRepository from "../repositories/UserRepository.js";


export const createOrder = async (req, res) => {
  try {
    const { amount, email, phone } = req.body;

    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await razorpayInstance.orders.create(options);

    const newPayment = await Payment.create({
      razorpayOrderId: order.id,
      amount,
      currency: "INR",
      email,
      phone,
      paymentStatus: "created",
    });

    return res.json({
      success: true,
      order,
      key: process.env.RAZORPAY_KEY_ID,
      paymentDBId: newPayment._id,
    });

  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ success: false, message: "Failed to create order" });
  }
};



export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      paymentDBId,
      campaignId,
      userEmail,
      mobileNumber
    } = req.body;

    const userId = req.user?._id


    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const payment = await Payment.findByIdAndUpdate(
      paymentDBId,
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paymentStatus: "success",
        email:userEmail,
        mobileNumber
      },
      { new: true }
    );

    const receiptId = "TRUDO-" + Date.now();

    const donation = await DonationTransaction.create({
      UserId: userId,
      CampaignId: campaignId,
      paymentId: payment._id,
      receiptId,
    });

    const user = UserRepository.findById(userId)
    const userName = user.userName
    console.log(userName,userEmail)

    return res.json({
      success: true,
      donation,
      receiptId,
      userEmail,
      userName
    });

  } catch (err) {
    console.error("Verification failed:", err);
    res.status(500).json({ success: false });
  }
};


export const getReceipt = async (req, res) => {
  try {
    const { receiptId } = req.params;

    const data = await getReceiptService(receiptId);

    res.json(data);
  } catch (error) {
    console.error("Receipt Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};