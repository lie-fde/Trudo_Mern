import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../../services/authService";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setAdminCredentials } from "../../store/adminAuthSlice";

export default function AdminLogin() {
  const [showPass, setShowPass] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { adminAccessToken } = useSelector((state) => state.adminAuth);

  useEffect(() => {
    if (adminAccessToken) {
      navigate("/admin/dashboard");
    }
  }, [adminAccessToken, navigate]);

  const onSubmit = async (data) => {
    try {
      const res = await adminLogin(data.email, data.password);
      dispatch(
        setAdminCredentials({
          adminAccessToken: res.data.adminAccessToken,
          adminName: res.data.admin.adminName,
          adminEmail: res.data.admin.adminEmail,
        })
      );
      toast.success("Logged in successfully!");
      navigate("/admin/dashboard", { replace: true });
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Trudo</h1>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="bg-white w-full max-w-sm p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-center mb-6">
            Admin Login
          </h2>

          <form
            noValidate
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5"
          >
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

            <button
              type="submit"
              className="w-full bg-green-800 text-white py-2 rounded-md text-sm hover:bg-green-900 transition"
            >
              Log in
            </button>
          </form>

          {message && (
            <p className="text-center text-red-500 text-sm mt-4">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
