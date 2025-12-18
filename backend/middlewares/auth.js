import jwt from "jsonwebtoken";
import UserRepository from "../repositories/UserRepository.js";

export default async function auth(req, res, next) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log(token);

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await UserRepository.findById(decoded.id);

    if (!user) {
      console.log("❌ User not found for decoded token!");
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; 
    console.log("✅ USER FOUND:", user._id);

    next();
  } catch (err) {
    console.log("❌ JWT ERROR:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
}
