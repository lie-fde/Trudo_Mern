import React, { useState, useRef, useEffect } from "react";
import { Camera } from "lucide-react";
import Navbar from "../../components/User/Navbar";
import api from "../../api/api";
import VerifyOTPProfile from "./ProfileEmailVerification";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [currentView, setCurrentView] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [originalEmail, setOriginalEmail] = useState("");

  const formDataToSend = new FormData();
  const navigate = useNavigate()

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.get(`/auth/users/profile`, {
          withCredentials: true,
        });

        const user = res.data.data;

        setFormData({
          fullName: user.userName || "",
          email: user.userEmail || "",
          phone: user.mobileNumber || "",
          gender: user.gender || "",
          dateOfBirth: user.dateOfBirth || "",
          address: user.address.address || "",
          street: user.address.street || "",
          city: user.address.city || "",
          state: user.address.state || "",
          pincode: user.address.pincode || "",
          country: user.address.country || "India",
          avatar:
            user.avatar ||
            "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
        });

        setOriginalEmail(user.userEmail);
      } catch (err) {
        console.error("Failed to load profile:", err);
      }
    }

    loadProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatar: file,
        avatarPreview: URL.createObjectURL(file),
      }));
    }
  };

  // ✅ VALIDATION (UNCHANGED)
  const validateForm = () => {
    const newErrors = {};
    const maxDOB = new Date("2010-12-31");

    if (!formData.phone?.trim())
      newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone))
      newErrors.phone = "Phone must be 10 digits";

    if (!formData.gender)
      newErrors.gender = "Gender is required";

    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = "Date of Birth is required";
    else if (new Date(formData.dateOfBirth) > maxDOB)
      newErrors.dateOfBirth = "DOB must be on or before 31-12-2010";

    if (!formData.address?.trim())
      newErrors.address = "Address is required";

    if (!formData.street?.trim())
      newErrors.street = "Street is required";

    if (!formData.city?.trim())
      newErrors.city = "City is required";

    if (!formData.state?.trim())
      newErrors.state = "State is required";

    if (!formData.pincode?.trim())
      newErrors.pincode = "Pincode is required";
    else if (!/^\d{6}$/.test(formData.pincode))
      newErrors.pincode = "Pincode must be 6 digits";

    if (!formData.country)
      newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOtpBeforeVerification = async (email) => {
    try {
      await api.get(`auth/users/profile/send-otp?email=${email}`, {
        withCredentials: true,
      });
      return true;
    } catch {
      return false;
    }
  };

  const handleEditClick = async () => {
    if (isEditing) {
      if (!validateForm()) return;

      const emailChanged = formData.email !== originalEmail;

      if (emailChanged) {
        const ok = await sendOtpBeforeVerification(formData.email);
        if (ok) {
          localStorage.setItem("tempEmail", formData.email);
          setCurrentView("verify");
        }
        return;
      }

      formDataToSend.append("userName", formData.fullName);
      formDataToSend.append("mobileNumber", formData.phone);
      formDataToSend.append("gender", formData.gender);
      formDataToSend.append("dateOfBirth", formData.dateOfBirth);
      formDataToSend.append(
        "address",
        JSON.stringify({
          address: formData.address,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: formData.country,
        })
      );

      if (formData.avatar instanceof File) {
        formDataToSend.append("avatar", formData.avatar);
      }

      await api.put("/auth/users/profile/update", formDataToSend, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      setIsEditing(false);
    } else {
      setOriginalEmail(formData.email);
      setIsEditing(true);
    }
  };

  if (currentView === "verify") {
    return (
      <VerifyOTPProfile
        onVerified={() => {
          setOriginalEmail(formData.email);
          setIsEditing(false);
          setCurrentView("profile");
        }}
        onCancel={() => {
          setFormData((p) => ({ ...p, email: originalEmail }));
          setCurrentView("profile");
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12 md:px-8">
        <div className="flex justify-center mb-12 relative group">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-black overflow-hidden">
              <img
                src={formData.avatarPreview || formData.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {isEditing && (
              <button
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 p-3 bg-black text-white rounded-full"
              >
                <Camera size={20} />
              </button>
            )}

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        {/* 🔒 ORIGINAL LAYOUT PRESERVED */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          {/* Full Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">
              Full name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-4 rounded-md bg-gray-100/80"
            />
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-4 rounded-md bg-gray-100/80"
            />
          </div>

          {/* Phone */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">
              Phone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-4 rounded-md bg-gray-100/80"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          {/* ✅ GENDER DROPDOWN */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-4 rounded-md bg-gray-100/80"
            >
              <option value="">Select gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">
                Prefer not to say
              </option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
            )}
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-4 rounded-md bg-gray-100/80"
            />
            {errors.dateOfBirth && (
              <p className="text-red-500 text-xs mt-1">
                {errors.dateOfBirth}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={2}
              className="w-full p-4 rounded-md bg-gray-100/80 resize-none"
            />
            {errors.address && (
              <p className="text-red-500 text-xs mt-1">
                {errors.address}
              </p>
            )}
          </div>

          {/* Street */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Street
            </label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-4 rounded-md bg-gray-100/80"
            />
            {errors.street && (
              <p className="text-red-500 text-xs mt-1">
                {errors.street}
              </p>
            )}
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              City
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-4 rounded-md bg-gray-100/80"
            />
            {errors.city && (
              <p className="text-red-500 text-xs mt-1">
                {errors.city}
              </p>
            )}
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              State
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-4 rounded-md bg-gray-100/80"
            />
            {errors.state && (
              <p className="text-red-500 text-xs mt-1">
                {errors.state}
              </p>
            )}
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Pincode
            </label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-4 rounded-md bg-gray-100/80"
            />
            {errors.pincode && (
              <p className="text-red-500 text-xs mt-1">
                {errors.pincode}
              </p>
            )}
          </div>

          {/* Country */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">
              Country
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-4 rounded-md bg-gray-100/80"
            >
              <option value="">Select country</option>
              <option>India</option>
              <option>USA</option>
              <option>UK</option>
              <option>Canada</option>
              <option>Australia</option>
            </select>
            {errors.country && (
              <p className="text-red-500 text-xs mt-1">
                {errors.country}
              </p>
            )}
          </div>
        </div>

        <div className="mt-12 flex justify-center gap-5">
          <button
            onClick={handleEditClick}
            className={`px-8 py-3 font-bold text-white ${
              isEditing ? "bg-green-600" : "bg-black"
            }`}
          >
            {isEditing ? "SAVE UPDATE" : "EDIT"}
          </button>
          <button  className={`px-12 py-3 font-bold text-white bg-black`}
          onClick={()=>navigate("/changePassword")}>
            Change Password
          </button>
        </div>
      </main>
    </div>
  );
}
