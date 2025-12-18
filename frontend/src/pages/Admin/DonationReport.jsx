import React, { useState, useEffect } from "react";
import {
  Search,
  Calendar,
  Download,
  ChevronLeft,
  ChevronRight,
  Users,
  HandHeart,
  DollarSign,
  Heart,
} from "lucide-react";
import.meta.env.VITE_API_URL;
import AdminNavbar from "../../components/Admin/AdminNavbar";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import { DataTable } from "../../components/reusable/DonationReport.jsx";
import Pagination from "../../components/reusable/Pagination.jsx";
import adminApi from "../../api/adminApi.js";
import { StatsCardReport } from "../../components/reusable/DonationReport.jsx";

const DonationReport = () => {
  const [collapsed, setCollapsed] = useState(false);

  // ---------------------
  // Admin donation states
  // ---------------------
  const [donations, setDonations] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [campaignFilter, setCampaignFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [loading, setLoading] = useState(false);

  const [stats, setStats] = useState({
    TotalUsers: 0,
    TotalCampaigns: 0,
    totalDonations: 0,
    ActiveCampaigns: 0,
  });

  // ------------------------
  // FETCH DONATION REPORT
  // ------------------------
  const fetchDonations = async () => {
    try {
      setLoading(true);

      const { data } = await adminApi.get("/admin/donations/report", {
        params: {
          page,
          limit,
          search,
          campaign: campaignFilter,
          from: fromDate,
          to: toDate,
        },
      });

      if (data.success) {
        setDonations(data.donations);
        setTotalPages(data.pages);
      }
    } catch (error) {
      console.log("Failed to fetch admin donations:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch whenever filters change
  useEffect(() => {
    fetchDonations();
  }, [page, search, campaignFilter, fromDate, toDate]);

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

  const handleExport = async () => {
    try {
      const response = await adminApi.get(`/admin/donations/report/export`, {
        params: {
          search,
          campaign: campaignFilter,
          from: fromDate,
          to: toDate,
        },
        responseType: "blob", // IMPORTANT
      });

      // Create a blob URL
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a download link
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "donations_report.csv");
      document.body.appendChild(link);

      link.click(); // auto-download

      document.body.removeChild(link);
    } catch (err) {
      console.error("Export failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* SIDEBAR */}
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* MAIN WRAPPER */}
      <div
        className="flex-1 transition-all duration-300"
        style={{
          marginLeft: collapsed ? 80 : 240,
          paddingTop: 72,
        }}
      >
        {/* NAVBAR */}
        <AdminNavbar collapsed={collapsed} />

        {/* MAIN CONTENT */}
        <main className="p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <StatsCardReport
              icon={Users}
              title={"Total Users"}
              value={stats.TotalUsers}
              color={"text-emerald-500"}
              bg={"bg-emerald-50"}
            />
            <StatsCardReport
              icon={HandHeart}
              title={"Total Campaigns"}
              value={stats.TotalCampaigns}
              color={"text-emerald-600"}
              bg={"bg-emerald-50"}
            />
            <StatsCardReport
              icon={DollarSign}
              title={"Total Donated"}
              value={stats.totalDonations}
              color={"text-emerald-700"}
              bg={"bg-emerald-50"}
            />
            <StatsCardReport
              icon={Heart}
              title={"Active Campaign"}
              value={stats.ActiveCampaigns}
              color={"text-emerald-500"}
              bg={"bg-emerald-50"}
            />
          </div>

          {/* FILTERS */}
          <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              {/* Search */}
              <div className="relative group w-full sm:w-64">
                <Search
                  size={18}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search user, campaign..."
                  value={search}
                  onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm focus:ring-2 focus:ring-gray-200"
                />
              </div>
            </div>

            {/* DATE FILTER */}
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg p-1.5 shadow-sm">
              <span className="text-xs font-bold text-gray-700 px-2">
                filter by
              </span>

              {/* From */}
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="text-xs bg-gray-50 rounded px-2 py-1 border border-gray-100"
              />

              {/* To */}
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="text-xs bg-gray-50 rounded px-2 py-1 border border-gray-100"
              />
            </div>
          </div>

          {/* TABLE */}
          <DataTable item={donations} loading={loading} />

          {/* PAGINATION */}
          <Pagination page={page} pages={totalPages} setPage={setPage} />

          {/* EXPORT */}
          <div className="flex justify-end mt--1">
            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-lg"
            >
              Export
              <Download size={16} />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DonationReport;
