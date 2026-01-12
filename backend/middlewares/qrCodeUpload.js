import QRCode from "qrcode";
import cloudinary from "../config/cloudinary.js";
import Ticket from "../models/Ticket.js";

export const generateAndUploadQR = async (text, ticketId) => {
  const buffer = await QRCode.toBuffer(text);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: "tickets/qr",
        public_id: `ticket_${ticketId}`,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    ).end(buffer);
  });
};

export const deleteQR = async (ticketId) => {
  await cloudinary.uploader.destroy(`tickets/qr/ticket_${ticketId}`);

    await Ticket.findByIdAndUpdate(ticketId, {
    $set: { qrCode: null },
  });
};
