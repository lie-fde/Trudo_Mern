import React, { useState } from "react";
import AdminSidebar from "../../components/Admin/AdminSidebar.jsx";
import AdminNavbar from "../../components/Admin/AdminNavbar.jsx";
import {Users,HandCoins,IndianRupee,CalendarDays,} from "lucide-react";
import { useSelector } from "react-redux";

export default function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const userName = useSelector((state)=> state.adminAuth.adminName)
  const userEmail = useSelector((state)=> state.adminAuth.adminEmail)
  console.log(userName)
   console.log(userEmail)

  const cards = [
    { label: "Total Users", value: "5,423", icon: <Users size={28} className="text-green-700" /> },
    { label: "Total Donations", value: "1,893", icon: <HandCoins size={28} className="text-green-700" /> },
    { label: "Total Amount", value: "₹65,805", icon: <IndianRupee size={28} className="text-green-700" /> },
    { label: "Total Events", value: "189", icon: <CalendarDays size={28} className="text-green-700" /> },
  ];

  return (
     <div className="bg-gray-50 min-h-screen">
      {/* FIXED SIDEBAR */}
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* MAIN CONTENT WITH SHIFT */}
      <div
        className="transition-all duration-300"
        style={{
          marginLeft: collapsed ? 80 : 240, // Key fix!
          paddingTop: 72, // navbar height
        }}
      >
        <AdminNavbar collapsed={collapsed} />
        <div className="p-8 mt-1">
          <h1 className="text-2xl font-semibold text-gray-800 mb-8">
            Dashboard Overview
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, i) => (
              <div
                key={i}
                className="bg-green-50 p-5 rounded-lg shadow-sm border border-green-100 flex items-center gap-4 hover:shadow-md transition"
              >
                <div className="p-3 bg-green-100 rounded-full">{card.icon}</div>
                <div>
                  <p className="text-sm text-gray-600">{card.label}</p>
                  <h2 className="text-xl font-bold text-gray-800">{card.value}</h2>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </div>
    </div>
  );
}
