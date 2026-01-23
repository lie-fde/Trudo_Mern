import jwt from "jsonwebtoken";
import UserRepository from "../repositories/UserRepository.js";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
export default async function adminAuth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "No token provided" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await UserRepository.findById(decoded.id);

    if (!admin || !admin.isAdmin) {
      return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Not authorized (Admin only)" });
    }
    console.log(admin._id);
    req.admin = admin;
    next();
  } catch (err) {
    return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
  }
}
