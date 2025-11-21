import React, { useState } from "react";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { resetPassword } from "../../services/authService";

export default function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail");

  const validatePassword = (value) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    return passwordRegex.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password.trim() || !confirmPassword.trim()) {
      setError("All fields are required");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be at least 6 characters, include one uppercase, one lowercase, and one number"
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await resetPassword(email,password)

      setMessage(res.data.message || "Password reset successful!");
      localStorage.removeItem("resetEmail");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-300 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6">Enter new Password</h1>

        <form onSubmit={handleSubmit} noValidate>
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter new Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full border ${
                error ? "border-red-500" : "border-gray-300"
              } rounded-md px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400`}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`w-full border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-md px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400`}
          />

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-md text-white text-sm font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-800 hover:bg-green-900"
            }`}
          >
            {loading ? "Updating..." : "Verify"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-gray-700 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
