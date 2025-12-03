

import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Camera } from 'lucide-react';
import Navbar from '../../components/User/Navbar';
import api from '../../api/api';
import VerifyOTPProfile from './ProfileEmailVerification';

export default function Profile() {
  const [currentView, setCurrentView] = useState('profile'); 
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({});
  const [originalEmail, setOriginalEmail] = useState("");
  const [tempEmail, setTempEmail] = useState("");

  const formDataToSend = new FormData();
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await api.get(`/auth/users/profile`, { withCredentials: true });

        const user = res.data.data;

        setFormData({
          fullName: user.userName || "",
          email: user.userEmail || "",
          phone: user.mobileNumber || "",
          gender: user.gender || "",
          dob: user.dob || "",
          address: user.address.address || "",
          street: user.address.street || "",
          city: user.address.city || "",
          state: user.address.state || "",
          pincode: user.address.pincode || "",
          country: user.address.country || "India",
          avatar:
            user.avatar ||
            "https://api.dicebear.com/7.x/avataaars/svg?seed=User"
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
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (file) {
    setFormData(prev => ({
      ...prev,
      avatar: file, // REAL FILE for upload
      avatarPreview: URL.createObjectURL(file) // PREVIEW URL
    }));
  }
};

  const sendOtpBeforeVerification = async (email) => {
    try {
      await api.get(`auth/users/profile/send-otp?email=${email}`, {
        withCredentials: true,
      });
      return true;
    } catch (err) {
      console.error("OTP Send Failed", err);
      return false;
    }
  };

 const handleEditClick = async () => {
  if (isEditing) {
    const emailChanged = formData.email !== originalEmail;

    if (emailChanged) {
      const email = formData.email;
      setTempEmail(email);

      const ok = await sendOtpBeforeVerification(email);
      if (ok) {
        localStorage.setItem("tempEmail", email);
        setCurrentView("verify");  // Move to OTP screen
      }
      return; 
    }

    formDataToSend.append("userName", formData.fullName);
formDataToSend.append("mobileNumber", formData.phone);
formDataToSend.append("gender", formData.gender);
formDataToSend.append("dateOfBirth", formData.dob);
formDataToSend.append("address", JSON.stringify({
  address: formData.address,
  street: formData.street,
  city: formData.city,
  state: formData.state,
  pincode: formData.pincode,
  country: formData.country,
}));

if (formData.avatar instanceof File) {
  formDataToSend.append("avatar", formData.avatar); 
}

   
    try {
      const res = await api.put(
        "/auth/users/profile/update",
        formDataToSend, {
  withCredentials: true,
  headers: { "Content-Type": "multipart/form-data" }
}
      );

      console.log("Profile Updated:", res.data);

      setIsEditing(false);
    } catch (err) {
      console.error("Profile update error:", err);
    }

  } else {
    // Enable editing mode
    setOriginalEmail(formData.email);
    setIsEditing(true);
  }
};



  const handleVerificationSuccess = () => {
    setOriginalEmail(formData.email);
    setIsEditing(false);
    setCurrentView('profile');
  };

  // Cancel OTP → restore old email
  const handleVerificationCancel = () => {
    setFormData(prev => ({ ...prev, email: originalEmail }));
    setCurrentView('profile');
  };


  if (currentView === 'verify') {
    return (
      <VerifyOTPProfile
        onVerified={handleVerificationSuccess}
        onCancel={handleVerificationCancel}
      />
    );
  }


  return (
    <div className="min-h-screen bg-white font-sans text-gray-800">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 py-12 md:px-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-normal text-black">
            Welcome <span className="font-medium">{formData.fullName || 'User'}</span>
          </h1>
        </div>

        {/* Profile Image Section */}
        <div className="flex justify-center mb-12 relative group">
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-black overflow-hidden border-4 border-white shadow-lg">
              <img
                src={formData.avatarPreview || formData.avatar}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Edit Image Button */}
            <button
              onClick={() => fileInputRef.current.click()}
              className={`absolute bottom-0 right-0 p-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all transform hover:scale-105 ${
                isEditing
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto"
              }`}
              title="Change Profile Picture"
            >
              <Camera size={20} />
            </button>

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
        </div>

        {/* FORM SECTION (UNCHANGED) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

          {/* Full Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">Full name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-4 rounded-md bg-gray-100/80 border-transparent focus:bg-white focus:ring-2 focus:ring-black transition-all ${
                !isEditing ? 'text-gray-500' : 'text-gray-900'
              }`}
            />
          </div>

          {/* Email */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              disabled={!isEditing}
              className={`w-full p-4 rounded-md bg-gray-100/80 focus:bg-white focus:ring-2 focus:ring-black transition-all ${
                !isEditing ? 'text-gray-500' : 'text-gray-900'
              }`}
            />
          </div>

          {/* Phone */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-4 rounded-md bg-gray-100/80"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-semibold mb-2">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-4 rounded-md bg-gray-100/80"
            >
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-semibold mb-2">Date of Birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-4 rounded-md bg-gray-100/80"
            />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              disabled={!isEditing}
              rows={2}
              className="w-full p-4 rounded-md bg-gray-100/80 resize-none"
            />
          </div>

          {/* Street */}
          <div>
            <label className="block text-sm font-semibold mb-2">Street</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-4 rounded-md bg-gray-100/80"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold mb-2">City</label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-4 rounded-md bg-gray-100/80"
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-semibold mb-2">State</label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-4 rounded-md bg-gray-100/80"
            />
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-sm font-semibold mb-2">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-4 rounded-md bg-gray-100/80"
            />
          </div>

          {/* Country */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-2">Country</label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-full p-4 rounded-md bg-gray-100/80"
            >
              <option>India</option>
              <option>USA</option>
              <option>UK</option>
              <option>Canada</option>
              <option>Australia</option>
            </select>
          </div>
        </div>

        {/* BUTTON */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={handleEditClick}
            className={`
              min-w-[200px] px-8 py-3 rounded-none font-bold tracking-widest text-sm transition-all duration-300
              ${
                isEditing
                  ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg transform hover:-translate-y-1'
                  : 'bg-black hover:bg-gray-800 text-white'
              }
            `}
          >
            {isEditing ? 'SAVE UPDATE' : 'EDIT'}
          </button>
        </div>
      </main>

      <div className="h-20"></div>
    </div>
  );
}
