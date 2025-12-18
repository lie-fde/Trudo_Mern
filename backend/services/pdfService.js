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
    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;

    /* -------------------- BORDER -------------------- */
    doc
      .rect(30, 30, pageWidth - 60, pageHeight - 60)
      .lineWidth(2)
      .stroke("#1E3A8A");

    /* -------------------- HEADER -------------------- */
    doc.fontSize(28).fillColor("#1E3A8A").text("TRUDO", { align: "center" });
    doc.fontSize(14).fillColor("#2563EB").text("True Donations", { align: "center" });

    doc.moveDown(0.5);
    doc.fontSize(18).fillColor("#111827").text("Donation Receipt Certificate", { align: "center" });

    doc.moveDown(1);
    doc.fontSize(12).fillColor("#4B5563").text(
      "This certificate proudly acknowledges the successful contribution made through Trudo – True Donations.",
      { align: "center" }
    );

    doc.moveDown(2);

    /* -------------------- AMOUNT -------------------- */
    const amountBoxY = doc.y;
    doc.roundedRect(150, amountBoxY, pageWidth - 300, 60, 10).fill("#EFF6FF");

    doc.fillColor("#1E40AF").fontSize(16).text(
      "DONATION AMOUNT",
      150,
      amountBoxY + 12,
      { width: pageWidth - 300, align: "center" }
    );

    doc.fontSize(22).fillColor("#111827").text(
      `₹ ${receiptData.amount}`,
      150,
      amountBoxY + 32,
      { width: pageWidth - 300, align: "center" }
    );

    doc.y = amountBoxY + 80;
    doc.moveDown(2);

    /* -------------------- DETAILS (FIXED) -------------------- */
    const contentWidth = 420;
    const labelWidth = 160;
    const startX = (pageWidth - contentWidth) / 2;
    const valueX = startX + labelWidth + 15;

    const details = [
      ["Receipt ID", receiptData.receiptId],
      ["Donor Name", receiptData.userName],
      ["Email Address", receiptData.userEmail],
      ["Campaign Name", receiptData.campaignName],
      ["Payment ID", receiptData.paymentId],
      ["Date", new Date(receiptData.date).toLocaleString()],
    ];

    details.forEach(([label, value]) => {
      const y = doc.y;

      // ✅ Label — LEFT aligned
      doc.font("Helvetica")
        .fontSize(12)
        .fillColor("#4B5563")
        .text(`${label} :`, startX, y, {
          width: labelWidth,
          align: "left",
        });

      // ✅ Value — LEFT aligned (unchanged)
      doc.font("Helvetica-Bold")
        .fillColor("#111827")
        .text(value, valueX, y, {
          width: contentWidth - labelWidth,
          align: "left",
        });

      doc.moveDown(0.8);
    });

    doc.moveDown(3);

    /* -------------------- FOOTER (FIXED CENTER) -------------------- */
    const footerLineY = doc.y;
    doc.moveTo(150, footerLineY).lineTo(pageWidth - 150, footerLineY).stroke("#9CA3AF");

    doc.moveDown(1);

    doc.font("Helvetica").fontSize(11).fillColor("#4B5563").text(
      "Authorized by Trudo – True Donations",
      0,
      doc.y,
      { width: pageWidth, align: "center" }
    );

    doc.fontSize(10).fillColor("#6B7280").text(
      "This is a system-generated receipt and does not require a physical signature.",
      0,
      doc.y,
      { width: pageWidth, align: "center" }
    );

    doc.end();

    /* -------------------- UPLOAD -------------------- */
    writeStream.on("finish", async () => {
      try {
        const uploadResult = await cloudinary.uploader.upload(filePath, {
          resource_type: "raw",
          folder: "trudo/receipts",
          public_id: receiptData.receiptId,
        });

        fs.unlinkSync(filePath);
        resolve(uploadResult.secure_url);
      } catch (error) {
        reject(error);
      }
    });

    writeStream.on("error", reject);
  });
};
