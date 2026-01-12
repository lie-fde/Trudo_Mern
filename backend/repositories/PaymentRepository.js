import DonationTransaction from "../models/DonationTransaction.js";
import Payment from "../models/Payment.js";
import { razorpayInstance } from "../config/razorpay.js";

export const findDonationByReceiptId = (receiptId) => {
  return DonationTransaction.findOne({ receiptId });
};

export const findPaymentById = (id) => {
  return Payment.findById(id);
};

export const createOrderRepo = async ({ amount, currency }) => {
  const order = await razorpayInstance.orders.create({
    amount: amount * 100, 
    currency,
    receipt: `rcpt_${Date.now()}`,
  });

  const payment = await Payment.create({
    razorpayOrderId: order.id,
    amount,
    currency,
    paymentStatus: "created",
  });

  return {
    order,
    paymentId: payment._id,
  };
};