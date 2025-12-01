import mongoose from "mongoose";


const campaignSchema = new mongoose.Schema(
  {
    
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    organizationName: {
      type: String,
      default: null,
    },
    organizationIDProof: {
      type: [String], 
      default: null,
    },

    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum:["Education", "Health", "Disaster Relief", "Other"],
      set: (value) => (value ? value.trim() : value),
    },
    location: {
      type: String,
      required: true,
    },
    image: {
      type: [String],
      required: true,
    },
    beneficiaryDocuments: {
      type: [String], 
      required: true,
    },
    beneficiary:{
      type:String,
      required:true
    },

    bankDetails: {
      accountNumber: { type: String, required: true },
      IFSCCode: { type: String, required: true },
    },

    targetAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    rejectionReason: { 
    type: String, 
    default: null // Empty by default
  },

    approvalDate: {
      type: Date,
      default: null,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },

      isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Campaign", campaignSchema);
