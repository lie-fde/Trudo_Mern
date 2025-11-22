import React from "react";
import { Bell, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";

export default function AdminNavbar({ collapsed }) {


  const adminName = useSelector((state)=> state.adminAuth.adminName) || "SHIBIN M S"

  const sidebarWidth = collapsed ? 80 : 256;
  const leftPx = `${sidebarWidth}px`;
  const widthCalc = `calc(100% - ${sidebarWidth}px)`; 

  return (
    <div
      className="fixed top-0 z-20 bg-white border-b border-gray-200 shadow-sm"
      style={{
        left: leftPx,
        width: widthCalc,
        height: 64,
      }}
    >
      <div className="h-full flex items-center justify-between px-6">
        <h1 className="text-lg font-semibold text-gray-800">Trudo Admin Panel</h1>

        <div className="flex items-center gap-6">
          <button className="relative text-gray-500 hover:text-green-700 transition">
            <Bell size={20} />
            <span className="absolute top-0 right-0 block h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-3 cursor-pointer">
            <img
              src="https://i.pravatar.cc/40?img=68"
              alt="Admin avatar"
              className="w-9 h-9 rounded-full border border-gray-300"
            />
            <div className="text-right leading-tight">
              <p className="text-sm font-medium text-gray-800">{adminName || "SHIBIN M S"}</p>
              <p className="text-xs text-gray-500 bg-green-100 px-2 rounded">Admin</p>
            </div>
            <ChevronDown size={18} className="text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  );
}
