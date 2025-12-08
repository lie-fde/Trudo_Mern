import mongoose from "mongoose";

const donationTransactionSchema = new mongoose.Schema(
  {
    CampaignId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Campaign",
      required: true,
    },

    receiptId: {
      type: String,
      required: true,
      unique: true,
    },
    receiptUrl: {
      type: String,
      default:null
    },

    UserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("DonationTransaction", donationTransactionSchema);
