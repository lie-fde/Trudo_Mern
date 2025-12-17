import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { resendOtp, verifyOtp } from "../../services/authService";
import api from "../../api/api";

export default function VerifyOTPProfile({ onVerified, onCancel }) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [message, setMessage] = useState("");
  const [resending, setResending] = useState(false);

  const email = localStorage.getItem("tempEmail");
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("tempEmail");
    if (!email) {
      navigate("/login");
    }
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  // Handle OTP input
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && e.target.nextSibling) {
      e.target.nextSibling.focus();
    }
  };

  const handleVerify = async () => {
    const otpGot = otp.join("");

    try {
      const response = await api.post(
        "/auth/users/profile/verify-otp",
        {
          newEmail: localStorage.getItem("tempEmail"),
          otp: otpGot,
        },
        { withCredentials: true }
      );

      setMessage(response.data.message);

      localStorage.removeItem("tempEmail");

      if (onVerified) onVerified();

      navigate("/profile", { replace: true });
    } catch (err) {
      setMessage(err.response?.data?.message || "Server error");
    }
  };

  // RESEND OTP
  const handleResendOtp = async () => {
    if (timer > 0) return;
    setResending(true);

    try {
      const response = await resendOtp(email);

      setMessage(response.data.message);
      setTimer(60);
    } catch (err) {
      setMessage(err.response?.data?.message || "Error resending OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-300 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-3">Verify OTP</h1>

        <p className="text-gray-600 mb-6">
          We've sent a verification code to <br />
          <span className="font-medium">{email}</span>
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-3 mb-6">
          {otp.map((value, index) => (
            <input
              key={index}
              type="text"
              maxLength="1"
              value={value}
              onChange={(e) => handleChange(e, index)}
              className="w-12 h-12 text-center border-2 border-gray-300 rounded-md text-lg focus:outline-none focus:border-pink-500"
            />
          ))}
        </div>

        <p className="text-gray-500 text-sm mb-2">
          Resend available in{" "}
          <span className="font-semibold">
            00:{timer.toString().padStart(2, "0")}
          </span>
        </p>

        <p className="text-gray-600 text-sm mb-4">
          Didn’t receive a code?{" "}
          <span
            onClick={handleResendOtp}
            className={`font-medium cursor-pointer ${
              timer > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-pink-600 hover:underline"
            }`}
          >
            {resending ? "Resending..." : "Resend OTP"}
          </span>
        </p>

        <button
          onClick={handleVerify}
          className="bg-green-900 text-white w-full py-2.5 rounded-md hover:bg-green-800 transition"
        >
          Verify
        </button>

        <button
          onClick={() => {
            if (onCancel) onCancel();
            localStorage.removeItem("tempEmail");
            navigate("/profile");
          }}
          className="mt-4 w-full py-2.5 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition"
        >
          Cancel
        </button>

        {message && (
          <p className="mt-3 text-gray-700 text-sm font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
