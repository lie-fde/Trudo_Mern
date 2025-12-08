import DonationTransaction from "../models/DonationTransaction.js";
import Payment from "../models/Payment.js";

export const findDonationByReceiptId = (receiptId) => {
  return DonationTransaction.findOne({ receiptId });
};

export const findPaymentById = (id) => {
  return Payment.findById(id);
};
