import nodeMailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * @param {Object} options
 * @param {string} options.to
 * @param {string} options.subject
 * @param {string} options.text
 * @param {string} [options.html]
 */
const sendMail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: process.env.MAIL_FROM,
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("📧 Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("❌ Email sending failed:", error.message);
    return false;
  }
};

export default sendMail;
