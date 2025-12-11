import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    User: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    images: {
      type: [String], // array of image URLs
      default: [],
    },

     category: {
      type: String,
      required: true,
      enum:["Education", "Health", "Technology", "Other"],
      set: (value) => (value ? value.trim() : value),
    },

    venue: {
      type: String,
      required: true,
    },

    eventTime: {
      type: String,
      required: true,
    },

    duration: {
      type: Number, // in minutes or hours
      required: true,
    },

    ticketPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    totalTickets: {
      type: Number,
      required: true,
      min: 1,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected", "Cancelled"],
      default: "Pending",
    },

    rejectionReason: {
      type: String,
      default: null, // Empty by default
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

    date: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

export default mongoose.model("Events", EventSchema);
