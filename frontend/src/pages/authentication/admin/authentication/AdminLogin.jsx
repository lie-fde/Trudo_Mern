import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [showPass, setShowPass] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(()=>{
    const adminToken =localStorage.getItem("adminToken")
     const token = localStorage.getItem('token')
     if(adminToken) navigate('/admin/dashboard')
     if(token) navigate('/home')
  },[navigate])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("http://localhost:4000/auth/admin/login", {
        adminEmail: data.email,
        password: data.password,
      });

      localStorage.setItem("adminToken", res.data.token);
      localStorage.setItem("adminName", res.data.admin.adminName);
      navigate("/admin/dashboard");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* ✅ Branding Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Trudo</h1>
      </div>

      {/* ✅ Centered Login Card */}
      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white w-full max-w-sm p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-6">Admin Login</h2>

          <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="admin@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address",
                  },
                })}
                className={`w-full border px-3 py-2 rounded-md mt-1 text-sm focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-green-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={`w-full border px-3 py-2 rounded-md mt-1 text-sm focus:outline-none focus:ring-2 ${
                    errors.password
                      ? "border-red-500 focus:ring-red-300"
                      : "border-gray-300 focus:ring-green-300"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-2.5 text-gray-500"
                >
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-green-800 text-white py-2 rounded-md text-sm hover:bg-green-900 transition"
            >
              Log in
            </button>
          </form>

          {/* Error / Success Message */}
          {message && (
            <p className="text-center text-red-500 text-sm mt-4">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
