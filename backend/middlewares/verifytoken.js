import jwt from "jsonwebtoken";
import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
export const verifyAccessToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Token expired" });
    req.user = user;
    next();
  });
};
