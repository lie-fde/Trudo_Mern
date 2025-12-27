import React, { useState } from "react";
import { replace, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { googleSign, loginUser } from "../../services/authService";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../store/authSlice";

export default function Login() {
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const cleanData = {
        email: data.email.trim(),
        password: data.password.trim(),
      };

      const response = await loginUser(cleanData.email, cleanData.password);

      reset();
      setMessage(response.data.message);

      dispatch(
        setCredentials({
          accessToken: response.data.accessToken,
          userName: response.data.user.userName,
          userEmail: response.data.user.userEmail,
          mobileNumber:response.data.user.mobileNumber
      
        })
      );
      toast.success("Logged in successfully!");
      navigate("/", { replace: true });
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Error connecting to server");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-pink-500 via-pink-400 to-yellow-300 p-4 overflow-hidden">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-3xl font-semibold text-center mb-2">Log in</h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          New to True Donation?{" "}
          <a href="/signup" className="underline text-gray-700">
            Sign up for free
          </a>
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
          noValidate
        >
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className={`w-full px-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                errors.email ? "border-red-500" : ""
              }`}
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
                validate: (value) => {
                  const trimmed = value.trim();
                  if (trimmed === "")
                    return "Email cannot be empty or spaces only";
                  if (/\s/.test(trimmed)) return "Email cannot contain spaces";
                  return true;
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                placeholder="Enter your password"
                className={`w-full px-4 py-3 border rounded-md pr-12 focus:outline-none focus:ring-2 focus:ring-pink-300 ${
                  errors.password ? "border-red-500" : ""
                }`}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                  validate: (value) => {
                    const trimmed = value.trim();
                    if (trimmed === "")
                      return "Password cannot be empty or spaces only";
                    if (/\s/.test(value))
                      return "Password cannot contain spaces";
                    return true;
                  },
                })}
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPass ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="flex justify-end">
            <a
              href="/forgot-password"
              className="text-sm text-gray-700 underline"
            >
              Forget password?
            </a>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full px-6 py-3 text-white rounded-full text-lg transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-gray-700 hover:bg-gray-800"
              }`}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </div>
        </form>

        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="h-px w-24 bg-gray-200" />
          <span className="text-xs text-gray-500">or</span>
          <div className="h-px w-24 bg-gray-200" />
        </div>

        <div className="mt-2 grid grid-cols-1 gap-3">
          <button
            onClick={() => window.location.replace(googleSign())}
            aria-label="Continue with Google"
            className="flex items-center justify-center gap-2 px-3 py-2 border rounded-full bg-white hover:shadow-sm"
          >
            <FcGoogle size={20} />
            Google
          </button>
        </div>
        {message && (
          <p className="mt-4 text-center text-red-600 text-sm font-semibold">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
