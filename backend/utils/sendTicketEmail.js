import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const sendTicketEmail = async (bookingDetails) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const templatePath = path.join(
    process.cwd(),
    "template",
    "ticketConfirmation.html"
  );

  let html = fs.readFileSync(templatePath, "utf-8");

  html = html
    .replace(/{{userName}}/g, bookingDetails.userName)
    .replace(/{{eventName}}/g, bookingDetails.eventName)
    .replace(/{{ticketId}}/g, bookingDetails.ticketId)
    .replace(/{{eventDate}}/g, bookingDetails.eventDate)
    .replace(/{{location}}/g, bookingDetails.location)
    .replace(/{{cloudinaryImageUrl}}/g, bookingDetails.cloudinaryImageUrl)
    .replace(/{{qrCodeImageUrl}}/g, bookingDetails.qrCodeImageUrl);

  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: bookingDetails.email,
    subject: `🎟 Ticket Confirmed – ${bookingDetails.eventName}`,
    html,
  });

  return { success: true };
};

export default sendTicketEmail;
