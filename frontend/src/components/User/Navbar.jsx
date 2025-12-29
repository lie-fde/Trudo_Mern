import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { setCredentials } from "../../store/authSlice";
import api from "../../api/api";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.auth.userName);

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout
  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await api.post("auth/users/logout");

        dispatch(
          setCredentials({
            accessToken: null,
            userName: null,
            userEmail:null,
            mobileNumber:null
          })
        );

        Swal.fire({
          icon: "success",
          title: "Logged out!",
          text: "You have been logged out successfully.",
          timer: 1500,
          showConfirmButton: false,
        });

        navigate("/", { replace: true });
      }
    });
  };

  return (
    <nav className="w-full bg-black text-white py-4 px-6 flex items-center justify-between shadow-md">
      <h1
        className="text-xl font-semibold tracking-wide cursor-pointer"
        onClick={() => navigate("/")}
      >
        Trudo
      </h1>

      <div className="hidden md:flex gap-6 text-sm items-center">
        <button className="hover:text-gray-300 transition" onClick={() => navigate("/")}>Home</button>
        <button className="hover:text-gray-300 transition" onClick={() => navigate("/campaigns")}>Donate</button>
        <button className="hover:text-gray-300 transition"onClick={()=>navigate("/events")}>Events</button>
        <button className="hover:text-gray-300 transition"onClick={()=>navigate("/mytickets")}>My Ticket</button>
        <button className="hover:text-gray-300 transition" onClick={()=>navigate("/my-donations")}>My Donation</button>
        <button className="hover:text-gray-300 transition"onClick={()=>navigate("/mycampaigns")}>My Campaigns</button>
        <button className="hover:text-gray-300 transition">Contact us</button>
      </div>

      {/* RIGHT SECTION */}
      <div className="relative" ref={dropdownRef}>
        {userName ? (
          <div>
            {/* BUTTON */}
            <button
              className="flex items-center gap-2 px-3 py-1 border border-white rounded-md hover:bg-white hover:text-black transition text-sm"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              Hi, {userName}
              <span className="text-xs">▼</span>
            </button>

            {/* DROPDOWN */}
            {isOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg py-2 z-50">
                <button
                  onClick={() => {
                    navigate(`/profile`);
                    setIsOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-1 rounded-md border border-white hover:bg-white hover:text-black transition text-sm"
          >
            Log in
          </button>
        )}
      </div>
    </nav>
  );
}
