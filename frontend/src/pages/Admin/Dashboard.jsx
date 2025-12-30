import React, { useState , useEffect } from "react";
import AdminSidebar from "../../components/Admin/AdminSidebar.jsx";
import AdminNavbar from "../../components/Admin/AdminNavbar.jsx";
import { Users, HandCoins, IndianRupee, CalendarDays } from "lucide-react";
import { useSelector } from "react-redux";
import { DonationBarChart } from "../../components/Admin/Dashboad.jsx";
import adminApi from "../../api/adminApi.js";

export default function AdminDashboard() {
  const [collapsed, setCollapsed] = useState(false);
  const userName = useSelector((state) => state.adminAuth.adminName);
  const userEmail = useSelector((state) => state.adminAuth.adminEmail);
  const [donationData, setDonationData] = useState([]);

     const [stats, setStats] = useState({
       TotalUsers: 0,
       TotalCampaigns: 0,
       totalDonations: 0,
       ActiveCampaigns: 0,
       TotalEvents:0
     });

     const [TotalEvents , setTotalEvents] = useState(0);



  useEffect(() => {
    async function loadStats() {
      try {
        const res = await adminApi.get("/admin/donations/report/stats");
        if (res.data.success) {
          setStats({
            TotalUsers: res.data.data.TotalUsers,
            TotalCampaigns: res.data.data.TotalCampaigns,
            totalDonations: res.data.data.totalDonations,
            ActiveCampaigns: res.data.data.ActiveCampaigns,
          });
        }
      } catch (err) {
        console.error("Stats load error:", err);
      }
    }

    loadStats();
  }, []);


    useEffect(() => {
    async function loadStats() {
      try {
        const res = await adminApi.get("/admin/events/report/stats");
        if (res.data.success) {
          setTotalEvents( res.data.data.TotalEvents);
        }
      } catch (err) {
        console.error("Stats load error:", err);
      }
    }

    loadStats();
  }, []);


  const cards = [
    {
      label: "Total Users",
      value: stats.TotalUsers,
      icon: <Users size={28} className="text-green-700" />,
    },
    {
      label: "Total Campaigns",
      value: stats.TotalCampaigns,
      icon: <HandCoins size={28} className="text-green-700" />,
    },
    {
      label: "Total Amount",
      value: stats.totalDonations,
      icon: <IndianRupee size={28} className="text-green-700" />,
    },
    {
      label: "Total Events",
      value: TotalEvents,
      icon: <CalendarDays size={28} className="text-green-700" />,
    },
  ];





  useEffect(() => {
  const fetchDonationGraph = async () => {
    try {
      const res = await adminApi.get("/admin/donations/graph");
      if (res.data.success) {
        setDonationData(res.data.data);
      }
    } catch (err) {
      console.error("Donation graph load failed", err);
    }
  };

  fetchDonationGraph();
}, []);

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
                  <h2 className="text-xl font-bold text-gray-800">
                    {card.value}
                  </h2>
                </div>
              </div>
            ))}
          </div>

         <div className="mt-10">
            <DonationBarChart data={donationData} />
          </div>

        </div>
      </div>
    </div>
  );
}
