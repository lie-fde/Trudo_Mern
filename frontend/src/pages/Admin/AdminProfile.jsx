import React, { useEffect, useState, useRef } from "react";
import { Camera } from "lucide-react";

import AdminNavbar from "../../components/Admin/AdminNavbar.jsx";
import AdminSidebar from "../../components/Admin/AdminSidebar.jsx";
import adminApi from "../../api/adminApi";

const ProfilePage = () => {
  // State to toggle between View and Edit modes (mimicking the two screenshots)
  const [isEditing, setIsEditing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({});
  const fileInputRef = useRef(null);

  

  useEffect(() => {
    async function loader() {
      const res = await adminApi.get("/admin/profile", {
        withCredentials: true,
      });

      const admin = res.data.data;

      setFormData({
        fullName: admin.userName,
        email: admin.userEmail,
        phone: admin.mobileNumber,
        avatar:
          admin.avatar ||
          "https://api.dicebear.com/7.x/avataaars/svg?seed=User",
      });
    }

    loader();
  }, []);

  const handleEditClick = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("userName", formData.fullName);
    formDataToSend.append("mobileNumber", formData.phone);

    if (formData.avatar instanceof File) {
      formDataToSend.append("avatar", formData.avatar); // Upload only if user changed image
    }

    try {
      const res = await adminApi.put("/admin/profile/update", formDataToSend, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("Profile Updated:", res.data);

      setIsEditing(false);
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        avatar: file, // REAL FILE for upload
        avatarPreview: URL.createObjectURL(file), // PREVIEW URL
      }));
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5F5] font-sans text-gray-800">
      <AdminSidebar />

      {/* ---------------- MAIN CONTENT ---------------- */}
      <main className="flex-1 ml-64 flex flex-col">
        <AdminNavbar />

        {/* Content Area */}
        <div className="flex-1 p-20 flex items-center justify-center">
          {/* Profile Card */}
          <div className="bg-white w-full max-w-3xl rounded-[2rem] shadow-sm p-12 min-h-[600px] flex flex-col items-center">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8 relative">
              {!isEditing && (
                <span className="text-xs font-bold text-gray-500 mb-4 tracking-wide">
                  WELCOME ADMIN
                </span>
              )}

              <div className="relative group">
                <div className="w-28 h-28 rounded-full bg-[#FFDbb0] overflow-hidden border-4 border-white shadow-lg mb-3">
                  <img
                    src={formData.avatarPreview || formData.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover transform scale-110 mt-2"
                  />
                </div>

                {/* Camera icon - only in edit mode */}
                {isEditing && (
                  <button
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 p-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-all transform hover:scale-105"
                    title="Change Profile Picture"
                  >
                    <Camera size={20} />
                  </button>
                )}

                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>

              {!isEditing ? (
                <h2 className="text-lg font-bold text-gray-800 underline decoration-gray-300 underline-offset-4 decoration-2">
                  {formData.fullName}
                </h2>
              ) : (
                <button className="text-xs font-medium text-gray-600 underline hover:text-black">
                  Edit Photo
                </button>
              )}
            </div>

            {/* Form Fields */}
            <div className="w-full max-w-xl space-y-5">
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs text-gray-500 ml-1">Full name</label>
                <div
                  className={`
                  w-full px-4 py-3 rounded-lg text-sm text-gray-700 transition-all
                  ${
                    isEditing
                      ? "bg-gray-50 border border-gray-200"
                      : "bg-gray-100/50 border border-transparent"
                  }
                `}
                >
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full bg-transparent outline-none"
                    />
                  ) : (
                    formData.fullName
                  )}
                </div>
              </div>

              {/* Email & Phone Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-gray-500 ml-1">Email</label>
                  <div
                    className={`
                    w-full px-4 py-3 rounded-lg text-sm text-gray-700 transition-all
                    ${
                      isEditing
                        ? "bg-gray-50 border border-gray-200"
                        : "bg-gray-100/50 border border-transparent"
                    }
                  `}
                  >
                    {isEditing ? (
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full bg-transparent outline-none"
                      />
                    ) : (
                      formData.email
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-500 ml-1">
                    Phone Number
                  </label>
                  <div
                    className={`
                    w-full px-4 py-3 rounded-lg text-sm text-gray-700 transition-all
                    ${
                      isEditing
                        ? "bg-gray-50 border border-gray-200"
                        : "bg-gray-100/50 border border-transparent"
                    }
                  `}
                  >
                    {isEditing ? (
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full bg-transparent outline-none"
                      />
                    ) : (
                      formData.phone
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-8 flex flex-col items-center gap-3">
                {isEditing ? (
                  /* Update Button (Edit Mode) */
                  <button
                    onClick={() => handleEditClick()}
                    className="bg-[#222] text-white px-12 py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-black transition-transform active:scale-95 shadow-lg shadow-gray-200"
                  >
                    Update
                  </button>
                ) : (
                  /* View Mode Buttons */
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-[#222] text-white px-12 py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-black transition-transform active:scale-95 shadow-lg shadow-gray-200 w-full md:w-auto"
                    >
                      Edit
                    </button>
                  
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
