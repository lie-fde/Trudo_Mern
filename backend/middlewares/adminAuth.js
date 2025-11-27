import jwt from "jsonwebtoken";
import UserRepository from "../repositories/UserRepository.js";

export default async function adminAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await UserRepository.findById(decoded.id);

    if (!admin || !admin.isAdmin) {
      return res.status(401).json({ message: "Not authorized (Admin only)" });
    }

    req.admin = admin;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
