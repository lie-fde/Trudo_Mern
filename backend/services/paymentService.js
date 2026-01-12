import {
  findDonationByReceiptId,
  findPaymentById,
} from "../repositories/PaymentRepository.js";
import UserRepository from "../repositories/UserRepository.js";

import { findCampaignById } from "../repositories/CampaignRepository.js";

import { generateReceiptPDF } from "./pdfService.js";
import { createOrderRepo } from "../repositories/PaymentRepository.js";

export const getReceiptService = async (receiptId) => {
  // 1. Fetch donation record
  const donation = await findDonationByReceiptId(receiptId);
  if (!donation) throw new Error("Receipt not found");

  // 2. Fetch related entities
  const payment = await findPaymentById(donation.paymentId);
  const user = await UserRepository.findById(donation.UserId);
  const campaign = await findCampaignById(donation.CampaignId);

  // 3. Create data object
  const receiptData = {
    receiptId,
    userName: user.userName,
    userEmail: user.userEmail,
    campaignName: campaign.title,
    amount: payment.amount,
    paymentId: payment.razorpayPaymentId,
    date: donation.createdAt,
  };

  if (donation.receiptUrl) {
    return {
      ...receiptData,
      pdfUrl: donation.receiptUrl,
    };
  }

  // 4. Generate PDF
  const cloudinaryReceiptUrl = await generateReceiptPDF(receiptData);

  donation.receiptUrl = cloudinaryReceiptUrl;

  await donation.save();

  return {
    ...receiptData,
    pdfUrl: cloudinaryReceiptUrl,
  };
};

export const createOrderService = async ({ amount }) => {
  if (!amount) {
    throw { status: 400, message: "Amount required" };
  }

  return await createOrderRepo({
    amount,
    currency: "INR",
  });
};
