import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { googleSign, signUp } from "../../services/authService";
import { useSelector } from "react-redux";

export default function Signup() {
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { accessToken } = useSelector((state) => state.auth);

  useEffect(() => {
    console.log(accessToken);
    if (accessToken) navigate("/");
  }, [navigate]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    localStorage.setItem("tempEmail", data.email);
    reset();
    setLoading(false);
    navigate("/verify-otp");
    try {
      const response = await signUp(
        data.fullName,
        data.email,
        data.mobile,
        data.password
      );

      setMessage(response.data.message);
      console.log(message);
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message);
        console.log(message);
      } else {
        setMessage("Error connecting to server");
      }
    }
  };

  const password = watch("password");
  const noSpacesPattern = /^\S+$/;

  return (
    <div className="h-screen w-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-pink-500 via-pink-400 to-yellow-300">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl px-10 py-5">
        <h1 className="text-2xl font-semibold text-center mb-3">Sign Up</h1>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-2.5"
        >
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Enter your full name"
              className={`w-full px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                errors.fullName ? "border-red-500" : ""
              }`}
              {...register("fullName", {
                required: "Full name is required",
                pattern: {
                  value: /^[A-Za-z]+(?: [A-Za-z]+)*$/,
                  message: "Only letters and single spaces allowed",
                },
                validate: (value) =>
                  value.trim() !== "" || "Full name cannot be empty",
              })}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs mt-0.5">
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className={`w-full px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                errors.email ? "border-red-500" : ""
              }`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
                validate: (value) =>
                  !/\s/.test(value) || "Email cannot contain spaces",
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-0.5">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Mobile Number
            </label>
            <input
              type="tel"
              placeholder="Enter your mobile number"
              className={`w-full px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                errors.mobile ? "border-red-500" : ""
              }`}
              {...register("mobile", {
                required: "Mobile number is required",
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: "Enter a valid 10-digit number",
                },
                validate: (value) =>
                  !/\s/.test(value) || "Mobile number cannot contain spaces",
              })}
            />
            {errors.mobile && (
              <p className="text-red-500 text-xs mt-0.5">
                {errors.mobile.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                className={`w-full px-3 py-1.5 border rounded-md pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                  errors.password ? "border-red-500" : ""
                }`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  validate: (value) =>
                    noSpacesPattern.test(value) ||
                    "Password cannot contain spaces",
                })}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-0.5">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPass ? "text" : "password"}
                placeholder="Re-enter your password"
                className={`w-full px-3 py-1.5 border rounded-md pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                  errors.confirmPassword ? "border-red-500" : ""
                }`}
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) => {
                    if (/\s/.test(value))
                      return "Confirm password cannot contain spaces";
                    if (value !== password) return "Passwords do not match";
                    return true;
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showConfirmPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-0.5">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <p className="text-center text-xs text-gray-500 pt-1">
            Already have an account?{" "}
            <a href="/login" className="underline text-gray-700">
              Log in
            </a>
          </p>

          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 text-white rounded-md text-sm transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800"
            }`}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>

          <div className="mt-2 flex items-center justify-center gap-3">
            <div className="h-px w-16 bg-gray-200" />
            <span className="text-xs text-gray-500">Or Register with</span>
            <div className="h-px w-16 bg-gray-200" />
          </div>

          <div className="mt-1.5">
            <button
              type="button"
              onClick={() => window.location.replace(googleSign())}
              className="w-full flex items-center justify-center gap-2 px-2 py-1.5 border rounded-full bg-white hover:shadow-sm"
            >
              <FcGoogle size={16} />
              <span className="text-gray-700 text-sm">Google</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
