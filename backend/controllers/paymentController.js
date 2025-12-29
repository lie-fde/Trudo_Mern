import { razorpayInstance } from "../config/razorpay.js";
import Payment from "../models/Payment.js";
import DonationTransaction from "../models/DonationTransaction.js";
import Ticket from "../models/Ticket.js";
import crypto from "crypto";
import {
  getReceiptService,
  createOrderService,
} from "../services/paymentService.js";
import UserRepository from "../repositories/UserRepository.js";
import QRCode from "qrcode";
import { generateAndUploadQR } from "../middlewares/qrCodeUpload.js";

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
      mobileNumber,
    } = req.body;

    const userId = req.user?._id;

    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSign !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    const payment = await Payment.findByIdAndUpdate(
      paymentDBId,
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paymentStatus: "success",
        email: userEmail,
        mobileNumber,
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

    const user = UserRepository.findById(userId);
    const userName = user.userName;
    console.log(userName, userEmail);

    return res.json({
      success: true,
      donation,
      receiptId,
      userEmail,
      userName,
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

export const createOrderController = async (req, res) => {
  try {
    const result = await createOrderService({
      amount: req.body.amount,
    });

    console.log(result);

    res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      ...result,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message,
    });
  }
};

// export const verifyPaymentEvent = async ({
//   ticketId,
//   razorpay_order_id,
//   razorpay_payment_id,
//   razorpay_signature,
// }) => {
//   const body = razorpay_order_id + "|" + razorpay_payment_id;

//   const expectedSignature = crypto
//     .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
//     .update(body)
//     .digest("hex");

//   if (expectedSignature !== razorpay_signature) {
//     throw { status: 400, message: "Invalid payment signature" };
//   }

//   // Update payment
//   await Payment.findOneAndUpdate(
//     { razorpayOrderId: razorpay_order_id },
//     {
//       razorpayPaymentId: razorpay_payment_id,
//       razorpaySignature: razorpay_signature,
//       paymentStatus: "success",
//     }
//   );

//   // Activate ticket
//   const ticket = await Tickets.findById(ticketId).populate("eventId");

//   if (!ticket || ticket.status !== "Locked") {
//     throw { status: 400, message: "Invalid ticket state" };
//   }

//   // 🔐 Generate QR (URL-based)
//   const qrUrl = `${process.env.FRONTEND_URL}/ticket/${ticket._id}`;
//   const qrCode = await QRCode.toDataURL(qrUrl);

//   ticket.status = "Active";
//   ticket.qrCode = qrCode;
//   ticket.paymentId = razorpay_payment_id;
//   ticket.bookingLockExpires = null;

//   await ticket.save();

//   return ticket;
// };

export const verifyPaymentEvent = async (req, res) => {
  try {
    const {
      ticketId,
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;
    console.log("🔍 VERIFY PAYMENT STARTED");
    console.log("ticketId:", ticketId);
    console.log("razorpay_order_id:", razorpay_order_id);
    console.log("razorpay_payment_id:", razorpay_payment_id);
    console.log("razorpay_signature:", razorpay_signature);

    console.log(
      "🔑 RAZORPAY_KEY_SECRET exists:",
      !!process.env.RAZORPAY_KEY_SECRET
    );

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    console.log("🔐 SIGNATURE BODY:", body);

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    console.log("EXPECTED SIGNATURE:", expectedSignature);

    if (expectedSignature !== razorpay_signature) {
      console.error("❌ SIGNATURE MISMATCH");
      throw { status: 400, message: "Invalid payment signature" };
    }

    console.log("✅ SIGNATURE VERIFIED");

    // Update payment
    const paymentUpdate = await Payment.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      {
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        paymentStatus: "success",
      },
      { new: true }
    );

    console.log("💳 PAYMENT UPDATED:", paymentUpdate?._id);

    // Activate ticket
    const ticket = await Ticket.findById(ticketId).populate("eventId");

    if (!ticket) {
      console.error("❌ TICKET NOT FOUND");
      throw { status: 400, message: "Invalid ticket state" };
    }

    console.log("🎟️ TICKET STATUS BEFORE:", ticket.status);
    console.log("⏳ LOCK EXPIRES AT:", ticket.bookingLockExpires);
    console.log("🕒 CURRENT TIME:", new Date());

    if (ticket.status !== "Locked") {
      console.error("❌ TICKET NOT IN LOCKED STATE");
      throw { status: 400, message: "Invalid ticket state" };
    }

    // 🔐 Generate QR (URL-based)
    // const qrUrl = `${process.env.FRONTEND_URL}/ticket/${ticket._id}`;
    // console.log("📎 QR URL:", qrUrl);

    // const qrCode = await QRCode.toDataURL(qrUrl);

    // ticket.status = "Active";
    // ticket.qrCode = qrCode;
    // ticket.paymentId = razorpay_payment_id;
    // ticket.bookingLockExpires = null;

    // await ticket.save();

    const qrText = `${process.env.FRONTEND_URL}/ticket/${ticket._id}`;
    const qrUrl = await generateAndUploadQR(qrText, ticket._id);

    ticket.status = "Active";
    ticket.qrCode = qrUrl;
    ticket.paymentId = razorpay_payment_id;
    ticket.bookingLockExpires = null;
    ticket.expiresAt = new Date(
      ticket.eventId.date.getTime() + ticket.eventId.duration * 60 * 60 * 1000
    );

    await ticket.save();

    console.log("✅ TICKET ACTIVATED:", ticket._id);

    return res.status(200).json({
      success: true,
      message: "Payment verified and ticket activated",
      ticketId: ticket._id,
    });
  } catch (err) {
    console.error("🔥 VERIFY PAYMENT ERROR:", err.message || err);
    throw err;
  }
};
