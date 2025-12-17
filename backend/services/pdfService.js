import PDFDocument from "pdfkit";
import fs from "fs";
import cloudinary from "../config/cloudinary.js";

export const generateReceiptPDF = (receiptData) => {
  return new Promise((resolve, reject) => {
    const folder = "uploads/receipts";

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }

    const filePath = `${folder}/${receiptData.receiptId}.pdf`;
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(filePath);

    doc.pipe(writeStream);

    doc.fontSize(22).text("TRUDO DONATION RECEIPT", { align: "center" });
    doc.moveDown();

    doc.fontSize(14).text(`Receipt ID: ${receiptData.receiptId}`);
    doc.text(`Donor: ${receiptData.userName}`);
    doc.text(`Email: ${receiptData.userEmail}`);
    doc.text(`Campaign: ${receiptData.campaignName}`);
    doc.text(`Amount: ₹${receiptData.amount}`);
    doc.text(`Payment ID: ${receiptData.paymentId}`);
    doc.text(`Date: ${new Date(receiptData.date).toLocaleString()}`);

    doc.end();

    writeStream.on("finish", async () => {
      try {
        // 1️⃣ Upload PDF to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(filePath, {
          resource_type: "raw", // important for PDF
          folder: "trudo/receipts",
          public_id: receiptData.receiptId,
        });

        // 2️⃣ Delete local file after uploading (optional but recommended)
        fs.unlinkSync(filePath);

        // 3️⃣ Return Cloudinary URL
        resolve(uploadResult.secure_url);
      } catch (error) {
        reject(error);
      }
    });
    writeStream.on("error", reject);
  });
};
