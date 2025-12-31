// import React, { useState, useRef, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import { setCredentials } from "../../store/authSlice";
// import api from "../../api/api";

// export default function Navbar() {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const userName = useSelector((state) => state.auth.userName);

//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef();

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     function handleClickOutside(event) {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsOpen(false);
//       }
//     }
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Logout
//   const handleLogout = () => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You will be logged out from your account.",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Logout",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         await api.post("auth/users/logout");

//         dispatch(
//           setCredentials({
//             accessToken: null,
//             userName: null,
//             userEmail:null,
//             mobileNumber:null
//           })
//         );

//         Swal.fire({
//           icon: "success",
//           title: "Logged out!",
//           text: "You have been logged out successfully.",
//           timer: 1500,
//           showConfirmButton: false,
//         });

//         navigate("/", { replace: true });
//       }
//     });
//   };

//   return (
//     <nav className="w-full bg-black text-white py-4 px-6 flex items-center justify-between shadow-md">
//       <h1
//         className="text-xl font-semibold tracking-wide cursor-pointer"
//         onClick={() => navigate("/")}
//       >
//         Trudo
//       </h1>

//       <div className="hidden md:flex gap-6 text-sm items-center">
//         <button className="hover:text-gray-300 transition" onClick={() => navigate("/")}>Home</button>
//         <button className="hover:text-gray-300 transition" onClick={() => navigate("/campaigns")}>Donate</button>
//         <button className="hover:text-gray-300 transition"onClick={()=>navigate("/events")}>Events</button>
//         <button className="hover:text-gray-300 transition"onClick={()=>navigate("/mytickets")}>My Ticket</button>
//         <button className="hover:text-gray-300 transition" onClick={()=>navigate("/my-donations")}>My Donation</button>
//         <button className="hover:text-gray-300 transition"onClick={()=>navigate("/mycampaigns")}>My Campaigns</button>
//         <button className="hover:text-gray-300 transition"onClick={()=>navigate("/contact")}>Contact us</button>
//       </div>

//       {/* RIGHT SECTION */}
//       <div className="relative" ref={dropdownRef}>
//         {userName ? (
//           <div>
//             {/* BUTTON */}
//             <button
//               className="flex items-center gap-2 px-3 py-1 border border-white rounded-md hover:bg-white hover:text-black transition text-sm"
//               onClick={() => setIsOpen((prev) => !prev)}
//             >
//               Hi, {userName}
//               <span className="text-xs">▼</span>
//             </button>

//             {/* DROPDOWN */}
//             {isOpen && (
//               <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-md shadow-lg py-2 z-50">
//                 <button
//                   onClick={() => {
//                     navigate(`/profile`);
//                     setIsOpen(false);
//                   }}
//                   className="block w-full text-left px-4 py-2 hover:bg-gray-100"
//                 >
//                   Profile
//                 </button>

//                 <button
//                   onClick={handleLogout}
//                   className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
//                 >
//                   Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         ) : (
//           <button
//             onClick={() => navigate("/login")}
//             className="px-4 py-1 rounded-md border border-white hover:bg-white hover:text-black transition text-sm"
//           >
//             Log in
//           </button>
//         )}
//       </div>
//     </nav>
//   );
// }

import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { setCredentials } from "../../store/authSlice";
import api from "../../api/api";
// Added icons for a better UI
import { Menu, X, ChevronDown, User, LogOut } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.auth.userName);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef();

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out from your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#000",
      confirmButtonText: "Logout",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.post("auth/users/logout");
          dispatch(setCredentials({ accessToken: null, userName: null, userEmail: null, mobileNumber: null }));
          Swal.fire({ icon: "success", title: "Logged out!", timer: 1500, showConfirmButton: false });
          navigate("/", { replace: true });
        } catch (error) {
          console.error("Logout failed", error);
        }
      }
    });
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Donate", path: "/campaigns" },
    { name: "Events", path: "/events" },
    { name: "My Ticket", path: "/mytickets" },
    { name: "My Donation", path: "/my-donations" },
    { name: "My Campaigns", path: "/mycampaigns" },
    { name: "Contact us", path: "/contact" },
  ];

  return (
    <nav className="w-full bg-black text-white sticky top-0 z-[100] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* LOGO */}
          <div className="flex-shrink-0 flex items-center">
            <h1 className="text-2xl font-bold tracking-tighter cursor-pointer" onClick={() => navigate("/")}>
              Trudo
            </h1>
          </div>

          {/* DESKTOP NAV LINKS */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => navigate(link.path)}
                className="text-sm font-medium hover:text-gray-400 transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>

          {/* RIGHT SECTION: PROFILE & MOBILE TOGGLE */}
          <div className="flex items-center gap-4">
            {/* User Profile Dropdown (Desktop) */}
            <div className="relative" ref={profileRef}>
              {userName ? (
                <div className="hidden md:block">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 border border-gray-700 rounded-full hover:bg-white hover:text-black transition text-sm"
                  >
                    <User size={16} />
                    <span>{userName}</span>
                    <ChevronDown size={14} className={`${isProfileOpen ? "rotate-180" : ""} transition-transform`} />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-lg shadow-xl py-2 z-50 animate-in fade-in zoom-in duration-150">
                      <button
                        onClick={() => { navigate("/profile"); setIsProfileOpen(false); }}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 transition"
                      >
                        <User size={16} /> Profile Settings
                      </button>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 transition"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => navigate("/login")}
                  className="hidden md:block px-5 py-1.5 rounded-full border border-white hover:bg-white hover:text-black transition text-sm font-medium"
                >
                  Log in
                </button>
              )}
            </div>

            {/* MOBILE MENU BUTTON */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md hover:bg-gray-900 focus:outline-none"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black border-t border-gray-800 px-4 pt-2 pb-6 space-y-1">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => { navigate(link.path); setIsMobileMenuOpen(false); }}
              className="block w-full text-left px-3 py-3 text-base font-medium hover:bg-gray-900 rounded-md"
            >
              {link.name}
            </button>
          ))}
          
          <div className="pt-4 mt-4 border-t border-gray-800">
            {userName ? (
              <>
                <button
                  onClick={() => { navigate("/profile"); setIsMobileMenuOpen(false); }}
                  className="flex items-center gap-3 w-full text-left px-3 py-3 text-base font-medium"
                >
                  <User size={20} /> Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full text-left px-3 py-3 text-base font-medium text-red-500"
                >
                  <LogOut size={20} /> Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => { navigate("/login"); setIsMobileMenuOpen(false); }}
                className="w-full bg-white text-black py-3 rounded-md font-bold"
              >
                Log In
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}