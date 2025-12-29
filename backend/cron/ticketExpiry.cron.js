import cron from "node-cron";
import Ticket from "../models/Ticket.js";
import { deleteQR } from "../middlewares/qrCodeUpload.js";

cron.schedule("*/1 * * * *", async () => {
  try {
    console.log("🕒 Running ticket expiry cron...");

    const expired = await Ticket.find({
      status: "Active",
      expiresAt: { $lt: new Date() },
    });

    for (const t of expired) {
      t.status = "Expired";
      await t.save();
      await deleteQR(t._id);
    }

    console.log(`✅ Expired ${expired.length} tickets`);
  } catch (err) {
    console.error("❌ Cron error:", err.message);
  }
});
