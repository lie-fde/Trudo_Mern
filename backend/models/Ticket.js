import mongoose from "mongoose";

const TicketSchema = new mongoose.Schema({
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Events",
    required: true,
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },

  qrCode: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    enum: ["Active", "Cancelled", "Expired"],
    default: "Active",
  },

  paymentId: {
    type: String,
    default: null,
  },

  receiptId: {
    type: String,
    default: null,
  },

  cancelledAt: {
    type: Date,
  },

  expiresAt: {
    type: Date, // event end time for auto-expiry
    required: true,
  },

  bookingLockExpires: {
    type: Date, // 5-minute booking lock
  },

}, { timestamps: true });

export default mongoose.model("Tickets", TicketSchema);
