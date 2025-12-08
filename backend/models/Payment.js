import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    razorpayOrderId: {
      type: String,
      required: true,
    },
    razorpayPaymentId: {
      type: String,
      default: null,
    },
    razorpaySignature: {
      type: String,
      default: null,
    },

    currency: {
      type: String,
      default: "INR",
    },
    amount: {
      type: Number,
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["created", "success", "failed"],
      default: "created",
    },

    paymentMethod: {
      type: String, // card / upi / wallet / netbanking
      default: null,
    },

    email: {
      type: String,
      default: null,
    },
    mobileNumber: {
      type: String,
      default: null,
    },

    // Refund fields (optional)
    refundId: {
      type: String,
      default: null,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
    refundStatus: {
      type: String,
      enum: ["pending", "processed", "failed", null],
      default: null,
    },
    refundCreatedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
