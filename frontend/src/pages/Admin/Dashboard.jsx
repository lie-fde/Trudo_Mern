import React, { useState, useEffect } from "react";
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
  const [yearlyData, setYearlyData] = useState([]);
  const [activeTab, setActiveTab] = useState("Monthly");

  const [stats, setStats] = useState({
    TotalUsers: 0,
    TotalCampaigns: 0,
    totalDonations: 0,
    ActiveCampaigns: 0,
    TotalEvents: 0,
  });

  const [TotalEvents, setTotalEvents] = useState(0);

  // Stats Load Logic (Existing)
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
          setTotalEvents(res.data.data.TotalEvents);
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

  // Graph Data Fetching (Existing)
  useEffect(() => {
    const fetchDonationGraph = async () => {
      try {
        const res = await adminApi.get("/admin/donations/graph");
        if (res.data.success) setDonationData(res.data.data);
      } catch (err) {
        console.error("Donation graph load failed", err);
      }
    };
    fetchDonationGraph();
  }, []);

  useEffect(() => {
    const fetchYearlyDonationGraph = async () => {
      try {
        const res = await adminApi.get("/admin/donations/graph/yearly");
        if (res.data.success) setYearlyData(res.data.data);
      } catch (error) {
        console.error("Failed to fetch yearly donation graph", error);
      }
    };
    fetchYearlyDonationGraph();
  }, []);

  const paddedYearlyData = () => {
    if (!yearlyData.length) return [];
    const realData = yearlyData;
    const lastYear = realData[realData.length - 1].year;
    const result = [];
    for (let i = 11; i >= 0; i--) {
      const year = lastYear - i;
      const found = realData.find((d) => d.year === year);
      result.push(found || { year, amount: 0, count: 0 });
    }
    return result;
  };

  const chartData = activeTab === "Monthly" ? donationData : paddedYearlyData();

  return (
    <div className="bg-gray-50 min-h-screen">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div
        className="transition-all duration-300"
        style={{
          // On mobile, we typically hide the sidebar or make it 0 width.
          // Assuming AdminSidebar handles its own visibility, we adjust margin:
          marginLeft:
            typeof window !== "undefined" && window.innerWidth < 768
              ? 0
              : collapsed
              ? 80
              : 240,
          paddingTop: 72,
        }}
      >
        <AdminNavbar collapsed={collapsed} setCollapsed={setCollapsed} />

        {/* Main responsive container */}
        <div className="p-4 md:p-8 mt-1">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-800 mb-6 md:mb-8">
            Dashboard Overview
          </h1>

          {/* Grid: 1 col on mobile, 2 on tablet, 4 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {cards.map((card, i) => (
              <div
                key={i}
                className="bg-green-50 p-4 md:p-5 rounded-lg shadow-sm border border-green-100 flex items-center gap-4 hover:shadow-md transition"
              >
                <div className="p-2 md:p-3 bg-green-100 rounded-full shrink-0">
                  {card.icon}
                </div>
                <div className="min-w-0">
                  {" "}
                  {/* min-w-0 prevents text overflow in flex */}
                  <p className="text-xs md:text-sm text-gray-600 truncate">
                    {card.label}
                  </p>
                  <h2 className="text-lg md:text-xl font-bold text-gray-800 truncate">
                    {card.value}
                  </h2>
                </div>
              </div>
            ))}
          </div>

          {/* Chart Container: Ensure it doesn't break layout */}
          <div className="mt-8 md:mt-10 bg-white p-4 rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
            <DonationBarChart
              data={chartData}
              setActiveTab={setActiveTab}
              activeTab={activeTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
