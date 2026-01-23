import { HTTP_STATUS } from "../constants/httpStatusCodes.js";
export const errorMiddleware = (err, req, res, next) => {
  console.error("🔥 Error:", err.message);

  const status = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};
