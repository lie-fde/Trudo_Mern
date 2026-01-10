// import React from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Gift,
//   Users,
//   Calendar,
//   FileText,
//   LogOut,
//   ChevronLeft,
//   ChevronRight,
//   ClipboardList,
//   UserCheck,
// } from "lucide-react";
// import Swal from "sweetalert2";
// import { useDispatch } from "react-redux";
// import { setAdminCredentials } from "../../store/adminAuthSlice";
// import adminApi from "../../api/adminApi";

// const AdminSidebar = ({ collapsed, setCollapsed }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
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
//       // className={`relative flex flex-col justify-between bg-white h-screen border-r transition-all duration-300 shadow-sm z-30`}
//       className="fixed left-0 top-0 h-screen bg-white border-r shadow-lg z-30 transition-all duration-300"
//       style={{ width: collapsed ? 80 : 256 }}
//     >
//       <button
//         onClick={() => setCollapsed(!collapsed)}
//         className="absolute top-4 -right-3 bg-white border border-gray-300 rounded-full shadow p-1 hover:bg-gray-100 transition z-40"
//       >
//         {collapsed ? (
//           <ChevronRight size={18} className="text-gray-600" />
//         ) : (
//           <ChevronLeft size={18} className="text-gray-600" />
//         )}
//       </button>

//       <div>
//         <div className="flex items-center px-6 py-5 border-b border-gray-200">
//           <Gift size={24} className="text-teal-600 min-w-8" />
//           {!collapsed && (
//             <h1
//               className={`text-2xl font-extrabold ml-3 text-gray-900 transition-opacity duration-300`}
//             >
//               Trudo
//             </h1>
//           )}
//         </div>

//         <ul className="mt-4 space-y-2 px-2">
//           <SidebarItem
//             icon={<LayoutDashboard size={20} />}
//             label="Dashboard"
//             collapsed={collapsed}
//             path="/admin/dashboard"
//           />
//           <SidebarItem
//             icon={<Gift size={20} />}
//             label="Campaigns"
//             collapsed={collapsed}
//             path="/admin/campaigns"
//           />
//           <SidebarItem
//             icon={<ClipboardList size={20} />}
//             label="Donation Report"
//             collapsed={collapsed}
//             path="/admin/donation-report"
//           />
//           <SidebarItem
//             icon={<Users size={20} />}
//             label="Users"
//             collapsed={collapsed}
//             path="/admin/users"
//           />
//           <SidebarItem
//             icon={<UserCheck size={20} />}
//             label="Campaign Request"
//             collapsed={collapsed}
//             path="/admin/campaigns-request"
//           />
//           <SidebarItem
//             icon={<UserCheck size={20} />}
//             label="Event Request"
//             collapsed={collapsed}
//             path="/admin/event-request"
//           />
//           <SidebarItem
//             icon={<Calendar size={20} />}
//             label="Events"
//             collapsed={collapsed}
//             path="/admin/events"
//           />
//           <SidebarItem
//             icon={<FileText size={20} />}
//             label="Event Report"
//             collapsed={collapsed}
//             path="/admin/event-report"
//           />
//         </ul>
//       </div>

//       <div className="p-4">
//         <button
//           onClick={() => handleLogout()}
//           className={`${
//             collapsed ? "w-10" : "w-full"
//           } flex items-center justify-center bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition`}
//         >
//           <LogOut size={18} className="mr-2" />
//           {!collapsed && "Logout"}
//         </button>
//       </div>
//     </div>
//   );
// };

// const SidebarItem = ({ icon, label, collapsed, active, path }) => {
//   return (
//     <NavLink
//       to={path}
//       className={({ isActive }) =>
//         `flex items-center gap-3 p-3 rounded-md cursor-pointer transition 
//         hover:bg-green-50 hover:text-green-700
//         ${
//           isActive ? "bg-green-100 text-green-700 font-medium" : "text-gray-700"
//         }
//         `
//       }
//     >
//       {icon}
//       {!collapsed && <span className="text-sm">{label}</span>}
//     </NavLink>
//   );
// };

// export default AdminSidebar;

// import React from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import {
//   LayoutDashboard,
//   Gift,
//   Users,
//   Calendar,
//   FileText,
//   LogOut,
//   ChevronLeft,
//   ChevronRight,
//   ClipboardList,
//   UserCheck,
//   X, // Added for mobile close button
// } from "lucide-react";
// import Swal from "sweetalert2";
// import { useDispatch } from "react-redux";
// import { setAdminCredentials } from "../../store/adminAuthSlice";
// import adminApi from "../../api/adminApi";

// const AdminSidebar = ({ collapsed, setCollapsed }) => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

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
//         try {
//           await adminApi.post("/auth/admin/logout");
//           dispatch(
//             setAdminCredentials({
//               adminAccessToken: null,
//               adminName: null,
//               adminEmail: null,
//             })
//           );
//           Swal.fire({
//             icon: "success",
//             title: "Logged Out",
//             text: "You have been successfully logged out!",
//             timer: 1500,
//             showConfirmButton: false,
//           });
//           navigate("/admin/login");
//         } catch (error) {
//           console.error("Logout failed", error);
//         }
//       }
//     });
//   };

//   return (
//     <>
//       {/* MOBILE OVERLAY: Dim background when sidebar is open on mobile */}
//       {!collapsed && (
//         <div
//           className="fixed inset-0 bg-black/50 z-[40] md:hidden transition-opacity"
//           onClick={() => setCollapsed(true)}
//         />
//       )}

//       {/* SIDEBAR CONTAINER */}
//       <div
//         className={`fixed left-0 top-0 h-screen bg-white border-r shadow-lg z-[50] transition-all duration-300 ease-in-out
//           ${collapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0"}
//         `}
//         style={{ width: collapsed ? 80 : 256 }}
//       >
//         {/* DESKTOP TOGGLE BUTTON (Hidden on Mobile) */}
//         <button
//           onClick={() => setCollapsed(!collapsed)}
//           className="hidden md:flex absolute top-4 -right-3 bg-white border border-gray-300 rounded-full shadow p-1 hover:bg-gray-100 transition z-50"
//         >
//           {collapsed ? (
//             <ChevronRight size={18} className="text-gray-600" />
//           ) : (
//             <ChevronLeft size={18} className="text-gray-600" />
//           )}
//         </button>

//         {/* MOBILE CLOSE BUTTON (Hidden on Desktop) */}
//         {!collapsed && (
//           <button
//             onClick={() => setCollapsed(true)}
//             className="md:hidden absolute top-4 right-4 text-gray-500"
//           >
//             <X size={24} />
//           </button>
//         )}

//         <div className="flex flex-col h-full">
//           {/* LOGO SECTION */}
//           <div className="flex items-center px-6 py-5 border-b border-gray-200">
//             <Gift size={24} className="text-teal-600 min-w-8" />
//             {!collapsed && (
//               <h1 className="text-2xl font-extrabold ml-3 text-gray-900 transition-opacity duration-300">
//                 Trudo
//               </h1>
//             )}
//           </div>

//           {/* NAV ITEMS */}
//           <nav className="flex-1 mt-4 overflow-y-auto no-scrollbar px-2 space-y-2">
//             <SidebarItem
//               icon={<LayoutDashboard size={20} />}
//               label="Dashboard"
//               collapsed={collapsed}
//               path="/admin/dashboard"
//             />
//             <SidebarItem
//               icon={<Gift size={20} />}
//               label="Campaigns"
//               collapsed={collapsed}
//               path="/admin/campaigns"
//             />
//             <SidebarItem
//               icon={<ClipboardList size={20} />}
//               label="Donation Report"
//               collapsed={collapsed}
//               path="/admin/donation-report"
//             />
//             <SidebarItem
//               icon={<Users size={20} />}
//               label="Users"
//               collapsed={collapsed}
//               path="/admin/users"
//             />
//             <SidebarItem
//               icon={<UserCheck size={20} />}
//               label="Campaign Request"
//               collapsed={collapsed}
//               path="/admin/campaigns-request"
//             />
//             <SidebarItem
//               icon={<UserCheck size={20} />}
//               label="Event Request"
//               collapsed={collapsed}
//               path="/admin/event-request"
//             />
//             <SidebarItem
//               icon={<Calendar size={20} />}
//               label="Events"
//               collapsed={collapsed}
//               path="/admin/events"
//             />
//             <SidebarItem
//               icon={<FileText size={20} />}
//               label="Event Report"
//               collapsed={collapsed}
//               path="/admin/event-report"
//             />
//           </nav>

//           {/* LOGOUT SECTION */}
//           <div className="p-4 border-t border-gray-100">
//             <button
//               onClick={handleLogout}
//               className={`flex items-center justify-center bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition shadow-md
//                 ${collapsed ? "w-10 px-0" : "w-full px-4"}
//               `}
//             >
//               <LogOut size={18} className={collapsed ? "" : "mr-2"} />
//               {!collapsed && <span className="font-medium">Logout</span>}
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// const SidebarItem = ({ icon, label, collapsed, path }) => {
//   return (
//     <NavLink
//       to={path}
//       className={({ isActive }) =>
//         `flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all duration-200
//         ${
//           isActive
//             ? "bg-green-100 text-green-700 font-semibold shadow-sm"
//             : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
//         }
//         ${collapsed ? "justify-center px-0" : "px-4"}
//         `
//       }
//     >
//       <div className="min-w-[20px]">{icon}</div>
//       {!collapsed && <span className="text-sm whitespace-nowrap">{label}</span>}
//     </NavLink>
//   );
// };

// export default AdminSidebar;
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Gift, Users, Calendar, FileText, 
  LogOut, ChevronLeft, ChevronRight, ClipboardList, UserCheck, X
} from "lucide-react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setAdminCredentials } from "../../store/adminAuthSlice";
import adminApi from "../../api/adminApi";

const AdminSidebar = ({ collapsed, setCollapsed }) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    Swal.fire({
      title: "Logout?",
      text: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, logout",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await adminApi.post("/auth/admin/logout");
        dispatch(setAdminCredentials({ adminAccessToken: null, adminName: null, adminEmail: null }));
      }
    });
  };

  return (
    <>
      {/* Mobile Overlay: Closes sidebar when clicking outside */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={() => setCollapsed(true)}
        />
      )}

      <div
        className={`fixed top-0 h-screen bg-white border-r shadow-lg z-50 transition-all duration-300 
          ${collapsed ? "-left-full md:left-0 md:w-20" : "left-0 w-64"}`}
      >
        {/* Toggle Button for Desktop */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden md:flex absolute top-4 -right-3 bg-white border border-gray-300 rounded-full shadow p-1 hover:bg-gray-100 transition z-50"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>

        {/* Close Button for Mobile */}
        <button 
          className="md:hidden absolute top-4 right-4 text-gray-600"
          onClick={() => setCollapsed(true)}
        >
          <X size={24} />
        </button>

        <div className="flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center px-6 py-5 border-b border-gray-200">
              <Gift size={24} className="text-teal-600 min-w-8" />
              {(!collapsed || (collapsed && window.innerWidth < 768)) && (
                <h1 className="text-2xl font-extrabold ml-3 text-gray-900">Trudo</h1>
              )}
            </div>

            <ul className="mt-4 space-y-1 px-2">
                <SidebarItem
              icon={<LayoutDashboard size={20} />}
              label="Dashboard"
              collapsed={collapsed}
              path="/admin/dashboard"
            />
            <SidebarItem
              icon={<Gift size={20} />}
              label="Campaigns"
              collapsed={collapsed}
              path="/admin/campaigns"
            />
            <SidebarItem
              icon={<ClipboardList size={20} />}
              label="Donation Report"
              collapsed={collapsed}
              path="/admin/donation-report"
            />
            <SidebarItem
              icon={<Users size={20} />}
              label="Users"
              collapsed={collapsed}
              path="/admin/users"
            />
            <SidebarItem
              icon={<UserCheck size={20} />}
              label="Campaign Request"
              collapsed={collapsed}
              path="/admin/campaigns-request"
            />
            <SidebarItem
              icon={<UserCheck size={20} />}
              label="Event Request"
              collapsed={collapsed}
              path="/admin/event-request"
            />
            <SidebarItem
              icon={<Calendar size={20} />}
              label="Events"
              collapsed={collapsed}
              path="/admin/events"
            />
            <SidebarItem
              icon={<FileText size={20} />}
              label="Event Report"
              collapsed={collapsed}
              path="/admin/event-report"
            />
            </ul>
          </div>

          <div className="p-4">
            <button
              onClick={handleLogout}
              className={`flex items-center justify-center bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition w-full 
                ${collapsed ? "md:px-0" : "px-4"}`}
            >
              <LogOut size={18} />
              {(!collapsed || (collapsed && window.innerWidth < 768)) && <span className="ml-2">Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const SidebarItem = ({ icon, label, path, collapsed }) => (
  <NavLink
    to={path}
    className={({ isActive }) =>
      `flex items-center gap-3 p-3 rounded-md transition hover:bg-green-50 hover:text-green-700
      ${isActive ? "bg-green-100 text-green-700 font-medium" : "text-gray-700"}`
    }
  >
    {icon}
    <span className={`${collapsed ? "md:hidden" : "block"} text-sm whitespace-nowrap`}>{label}</span>
  </NavLink>
);

export default AdminSidebar;