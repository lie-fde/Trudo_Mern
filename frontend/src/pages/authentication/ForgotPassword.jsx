import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Custom email validation using regex
  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/; 
    return emailRegex.test(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // ✅ Manual email validation before request
    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address (e.g., user@example.com)");
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:4000/auth/users/forgot-password", {
        email,
      });
      console.log(res.data.message)
      setMessage(res.data.message);
      console.log(message)
      localStorage.setItem("resetEmail", email); // store for next step
      navigate("/verify-otp-password");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error sending reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-pink-500 via-orange-400 to-yellow-300 p-4">
      <div className="bg-white shadow-xl rounded-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6">Forgot Password ?</h1>

        <form onSubmit={handleSubmit} noValidate>
          <p className="text-gray-600 mb-3">Enter your registered email</p>

          <input
            type="text"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full border ${
              error ? "border-red-500" : "border-gray-300"
            } rounded-md px-3 py-2 mb-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-400`}
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
            {loading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-sm text-gray-700 font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
