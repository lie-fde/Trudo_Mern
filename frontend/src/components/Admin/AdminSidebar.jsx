import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {LayoutDashboard,Gift,Users,Calendar,FileText,LogOut,ChevronLeft,ChevronRight,ClipboardList,UserCheck,} from "lucide-react";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { setAdminCredentials } from "../../store/adminAuthSlice";
import adminApi from "../../api/adminApi";



const AdminSidebar = ({ collapsed, setCollapsed }) => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
   const handleLogout = () => {
  Swal.fire({
    title: "Logout?",
    text: "Are you sure you want to logout from the admin panel?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, logout"
  }).then(async(result) => {
    if (result.isConfirmed) {
      
      await adminApi.post('/auth/admin/logout')

      dispatch(setAdminCredentials({
         adminAccessToken: null,
         adminName: null,
        adminEmail: null,
      }))

       Swal.fire({
        icon: "success",
        title: "Logged Out",
        text: "You have been successfully logged out!",
        timer: 1500,
        showConfirmButton: false
      });

    }
  });
};

  return (
    <div
      // className={`relative flex flex-col justify-between bg-white h-screen border-r transition-all duration-300 shadow-sm z-30`}
      className="fixed left-0 top-0 h-screen bg-white border-r shadow-lg z-30 transition-all duration-300"
      style={{ width: collapsed ? 80 : 256 }}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-4 -right-3 bg-white border border-gray-300 rounded-full shadow p-1 hover:bg-gray-100 transition z-40"
      >
        {collapsed ? (
          <ChevronRight size={18} className="text-gray-600" />
        ) : (
          <ChevronLeft size={18} className="text-gray-600" />
        )}
      </button>

      <div>
         <div className="flex items-center px-6 py-5 border-b border-gray-200">
                            <Gift size={24} className="text-teal-600 min-w-8" />
                            {!collapsed && (
                                <h1 className={`text-2xl font-extrabold ml-3 text-gray-900 transition-opacity duration-300`}>
                                    Trudo
                                </h1>
                            )}
                        </div>

        <ul className="mt-4 space-y-2 px-2">
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
          onClick={()=> handleLogout()}
          className={`${
            collapsed ? "w-10" : "w-full"
          } flex items-center justify-center bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition`}
        >
          <LogOut size={18} className="mr-2" />
          {!collapsed && "Logout"}
        </button>
      </div>
    </div>
  );
};

const SidebarItem = ({ icon, label, collapsed, active  , path}) => {
  return (
    <NavLink
      to={path}
    className={({ isActive }) =>
        `flex items-center gap-3 p-3 rounded-md cursor-pointer transition 
        hover:bg-green-50 hover:text-green-700
        ${isActive ? "bg-green-100 text-green-700 font-medium" : "text-gray-700"}
        `
      }
    >
      {icon}
      {!collapsed && <span className="text-sm">{label}</span>}
    </NavLink>
  );
};

export default AdminSidebar;
