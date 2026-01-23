
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