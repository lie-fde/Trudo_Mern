// import React, { useState, useRef, useEffect } from "react";
// import { Bell, ChevronDown, User, LogOut } from "lucide-react";
// import { useSelector, useDispatch } from "react-redux";
// import { setAdminCredentials } from "../../store/adminAuthSlice"; // <-- optional
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import adminApi from "../../api/adminApi";

// export default function AdminNavbar({ collapsed }) {
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   const adminName =
//     useSelector((state) => state.adminAuth.adminName) || "SHIBIN M S";
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const sidebarWidth = collapsed ? 80 : 256;
//   const leftPx = `${sidebarWidth}px`;
//   const widthCalc = `calc(100% - ${sidebarWidth}px)`;

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     Swal.fire({
//       title: "Logout?",
//       text: "Are you sure you want to logout from the admin panel?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, logout",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         await adminApi.post("/auth/admin/logout");

//         dispatch(
//           setAdminCredentials({
//             adminAccessToken: null,
//             adminName: null,
//             adminEmail: null,
//           })
//         );

//         Swal.fire({
//           icon: "success",
//           title: "Logged Out",
//           text: "You have been successfully logged out!",
//           timer: 1500,
//           showConfirmButton: false,
//         });
//       }
//     });
//   };

//   return (
//     <div
//       className="fixed top-0 z-20 bg-white border-b border-gray-200 shadow-sm"
//       style={{ left: leftPx, width: widthCalc, height: 64 }}
//     >
//       <div className="h-full flex items-center justify-between px-6">
//         <h1 className="text-xl font-bold text-gray-800 tracking-wide">
//           Trudo Admin Panel
//         </h1>

//         <div className="flex items-center gap-6">
//           {/* BELL ICON */}
//           <button className="relative text-gray-500 hover:text-green-700 transition">
//             <Bell size={20} />
//             <span className="absolute top-0 right-0 block h-2 w-2 bg-red-500 rounded-full"></span>
//           </button>

//           {/* PROFILE + DROPDOWN */}
//           <div className="relative" ref={dropdownRef}>
//             <div
//               className="flex items-center gap-3 cursor-pointer"
//               onClick={() => setOpen((prev) => !prev)}
//             >
//               <img
//                 src="https://i.pravatar.cc/40?img=68"
//                 alt="Admin avatar"
//                 className="w-9 h-9 rounded-full border border-gray-300"
//               />
//               <div className="text-right leading-tight">
//                 <p className="text-sm font-medium text-gray-800">{adminName}</p>
//                 <p className="text-xs text-gray-500 bg-green-100 px-2 rounded">
//                   Admin
//                 </p>
//               </div>
//               <ChevronDown size={18} className="text-gray-500" />
//             </div>

//             {/* DROPDOWN MENU */}
//             {open && (
//               <div className="absolute right-0 mt-2 w-40 bg-white border shadow-lg rounded-md py-2 animate-fadeIn">
//                 <button
//                   className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm"
//                   onClick={() => navigate("/admin/profile")}
//                 >
//                   <User size={16} /> Profile
//                 </button>

//                 <button
//                   className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 text-sm"
//                   onClick={handleLogout}
//                 >
//                   <LogOut size={16} /> Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import React, { useState, useRef, useEffect } from "react";
// import { Bell, ChevronDown, User, LogOut, Menu } from "lucide-react"; // Added Menu
// import { useSelector, useDispatch } from "react-redux";
// import { setAdminCredentials } from "../../store/adminAuthSlice";
// import { useNavigate } from "react-router-dom";
// import Swal from "sweetalert2";
// import adminApi from "../../api/adminApi";

// // Destructure setCollapsed from props
// export default function AdminNavbar({ collapsed, setCollapsed }) {
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   const adminName = useSelector((state) => state.adminAuth.adminName) || "SHIBIN M S";
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const handleClickOutside = (e) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
//         setOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const handleLogout = () => {
//     Swal.fire({
//       title: "Logout?",
//       text: "Are you sure you want to logout from the admin panel?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, logout",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         await adminApi.post("/auth/admin/logout");
//         dispatch(setAdminCredentials({
//           adminAccessToken: null,
//           adminName: null,
//           adminEmail: null,
//         }));
//         Swal.fire({
//           icon: "success",
//           title: "Logged Out",
//           timer: 1500,
//           showConfirmButton: false,
//         });
//       }
//     });
//   };

//   return (
//     <div
//       className={`fixed top-0 right-0 z-20 bg-white border-b border-gray-200 shadow-sm transition-all duration-300 h-16
//         /* MOBILE: Full width */
//         left-0 w-full 
//         /* DESKTOP: Adjust based on sidebar width */
//         ${collapsed ? "md:left-20 md:w-[calc(100%-80px)]" : "md:left-64 md:w-[calc(100%-256px)]"}
//       `}
//     >
//       <div className="h-full flex items-center justify-between px-4 md:px-6">
//         <div className="flex items-center gap-4">
//           {/* HAMBURGER ICON: Only visible on mobile */}
//           <button
//             onClick={() => setCollapsed(false)} // Opens the sidebar
//             className="p-2 rounded-md hover:bg-gray-100 md:hidden text-gray-600"
//           >
//             <Menu size={24} />
//           </button>

//           <h1 className="text-lg md:text-xl font-bold text-gray-800 tracking-wide truncate">
//             {/* Shorten title on mobile if needed */}
//             <span className="hidden sm:inline">Trudo Admin Panel</span>
//             <span className="sm:hidden text-teal-600">Trudo</span>
//           </h1>
//         </div>

//         <div className="flex items-center gap-3 md:gap-6">
//           <button className="relative text-gray-500 hover:text-green-700 transition">
//             <Bell size={20} />
//             <span className="absolute top-0 right-0 block h-2 w-2 bg-red-500 rounded-full border border-white"></span>
//           </button>

//           <div className="relative" ref={dropdownRef}>
//             <div
//               className="flex items-center gap-2 md:gap-3 cursor-pointer"
//               onClick={() => setOpen((prev) => !prev)}
//             >
//               <img
//                 src="https://i.pravatar.cc/40?img=68"
//                 alt="Admin avatar"
//                 className="w-8 h-8 md:w-9 md:h-9 rounded-full border border-gray-300"
//               />
//               <div className="text-right leading-tight hidden xs:block">
//                 <p className="text-sm font-medium text-gray-800 line-clamp-1">{adminName}</p>
//                 <p className="text-[10px] text-green-700 bg-green-100 px-1 rounded inline-block">
//                   Admin
//                 </p>
//               </div>
//               <ChevronDown size={16} className="text-gray-500" />
//             </div>

//             {open && (
//               <div className="absolute right-0 mt-2 w-40 bg-white border shadow-lg rounded-md py-2 z-50">
//                 <button
//                   className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm"
//                   onClick={() => navigate("/admin/profile")}
//                 >
//                   <User size={16} /> Profile
//                 </button>
//                 <button
//                   className="flex items-center gap-2 w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600 text-sm"
//                   onClick={handleLogout}
//                 >
//                   <LogOut size={16} /> Logout
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useRef, useEffect } from "react";
import { Bell, ChevronDown, User, LogOut, Menu } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { setAdminCredentials } from "../../store/adminAuthSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import adminApi from "../../api/adminApi";

export default function AdminNavbar({ collapsed, setCollapsed }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // FIXED: Fetching adminName from Redux
  const adminName = useSelector((state) => state.adminAuth.adminName) || "Admin User";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await adminApi.post("/auth/admin/logout");
        dispatch(setAdminCredentials({ adminAccessToken: null, adminName: null, adminEmail: null }));
      }
    });
  };

  return (
    <div className={`fixed top-0 right-0 z-20 bg-white border-b border-gray-200 shadow-sm transition-all duration-300 h-16 left-0 w-full 
      ${collapsed ? "md:pl-20" : "md:pl-64"}`}>
      
      <div className="h-full flex items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4">
          {/* Hamburger only visible on mobile AND when sidebar is collapsed */}
          <button
            onClick={() => setCollapsed(false)}
            className="p-2 rounded-md hover:bg-gray-100 md:hidden text-gray-600"
          >
            <Menu size={24} />
          </button>

          <h1 className="text-lg font-bold text-gray-800">
            <span className="hidden sm:inline">Trudo Admin Panel</span>
            <span className="sm:hidden text-teal-600">Trudo</span>
          </h1>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <button className="relative text-gray-500 hover:text-green-700">
            <Bell size={20} />
            <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setOpen(!open)}>
              <img src="https://i.pravatar.cc/40?img=68" alt="avatar" className="w-8 h-8 rounded-full border" />
              {/* FIXED: Removed hidden class to show name */}
              <div className="text-left leading-tight block">
                <p className="text-sm font-medium text-gray-800">{adminName}</p>
                <p className="text-[10px] text-green-700 bg-green-100 px-1 rounded inline-block">Admin</p>
              </div>
              <ChevronDown size={16} className="text-gray-500" />
            </div>

            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white border shadow-xl rounded-md py-2 z-50">
                <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-sm" onClick={() => navigate("/admin/profile")}>
                  <User size={16} /> Profile
                </button>
                <button className="flex items-center gap-2 w-full px-4 py-2 hover:bg-gray-100 text-red-600 text-sm" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}