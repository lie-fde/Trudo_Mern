import jwt from "jsonwebtoken";
import UserRepository from "../repositories/UserRepository.js";

export default async function auth(req, res, next) {
     console.log("Authorization Header:", req.headers.authorization);
  console.log("Full Headers:", req.headers);
  try {
    const token = req.headers.authorization?.split(" ")[1];

        if (!token) {
      console.log("❌ No token received!");
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await UserRepository.findById(decoded.id);

    if (!req.user) {
      console.log("❌ User not found for decoded token!");
      return res.status(401).json({ message: "User not found" });
    }

     console.log("✅ USER FOUND:", req.user._id);
    next();
  } catch (err) {
     console.log("❌ JWT ERROR:", err.message);
    return res.status(401).json({ message: "Unauthorized" });
  }
}
