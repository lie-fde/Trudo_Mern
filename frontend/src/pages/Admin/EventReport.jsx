// import React, { useState, useMemo } from 'react';
// import {
//   LayoutDashboard,
//   Calendar,
//   Users,
//   DollarSign,
//   Search,
//   Bell,
//   ChevronRight,
//   Filter,
//   Download,
//   MoreVertical,
//   CheckCircle2,
//   Clock,
//   XCircle,
//   Menu,
//   ChevronDown,
//   Ticket,
//   CalendarDays,
//   Layers,
//   Settings,
//   Briefcase
// } from 'lucide-react';
// import AdminSidebar from '../../components/Admin/AdminSidebar';
// import AdminNavbar from '../../components/Admin/AdminNavbar';

// // --- Sub-components ---

// const StatCard = ({ title, value, icon: Icon, iconBg, iconColor }) => (
//   <div className="bg-white p-6 rounded-xl shadow-sm border border-transparent hover:border-blue-100 transition-all flex items-center justify-between group">
//     <div>
//       <p className="text-sm font-bold text-gray-400 mb-1 uppercase tracking-tight">{title}</p>
//       <h3 className="text-2xl font-black text-gray-800 tracking-tighter">{value}</h3>
//     </div>
//     <div className={`p-4 rounded-xl ${iconBg} ${iconColor} transition-transform group-hover:scale-110`}>
//       <Icon size={24} strokeWidth={2.5} />
//     </div>
//   </div>
// );
// const Pagination = ({ totalItems, itemsPerPage, currentPage }) => {
//   return (
//     <div className="px-8 py-6 bg-white border-t border-gray-50 flex flex-col sm:flex-row items-center justify-between gap-4">
//       <div className="flex items-center gap-4">
//         <select className="bg-[#F3F6F9] border-none text-[11px] font-black text-[#3699FF] rounded-lg px-3 py-2 outline-none cursor-pointer">
//           <option>{itemsPerPage} per page</option>
//           <option>25 per page</option>
//           <option>50 per page</option>
//         </select>
//         <span className="text-[11px] font-black text-[#B5B5C3] uppercase tracking-widest">
//           Showing 1 - {totalItems < itemsPerPage ? totalItems : itemsPerPage} of {totalItems}
//         </span>
//       </div>
//       <div className="flex gap-1.5">
//         <button className="w-9 h-9 flex items-center justify-center bg-[#F3F6F9] text-[#B5B5C3] rounded-lg font-black text-xs cursor-not-allowed">
//           <ChevronRight className="rotate-180" size={14} />
//         </button>
//         <button className="w-9 h-9 flex items-center justify-center bg-[#3699FF] text-white rounded-lg font-black text-xs shadow-lg shadow-blue-200">1</button>
//         <button className="w-9 h-9 flex items-center justify-center bg-[#F3F6F9] text-[#464E5F] rounded-lg font-black text-xs hover:bg-[#3699FF] hover:text-white transition-all">2</button>
//         <button className="w-9 h-9 flex items-center justify-center bg-[#F3F6F9] text-[#464E5F] rounded-lg font-black text-xs hover:bg-[#3699FF] hover:text-white transition-all">3</button>
//         <button className="w-9 h-9 flex items-center justify-center bg-[#F3F6F9] text-[#3699FF] rounded-lg font-black text-xs hover:bg-[#3699FF] hover:text-white transition-all">
//           <ChevronRight size={14} />
//         </button>
//       </div>
//     </div>
//   );
// };

// // --- Main App Component ---

// const EventReport = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);
//    const [collapsed, setCollapsed] = useState(false);

//   // Mock Data
//   const MOCK_DATA = [
//     { id: 1, eventName: "Tech Frontier 2024", userEmail: "alex.j@example.com", username: "alex_j", status: "Confirmed", tickets: 2, date: "2024-05-15", amount: 250.00 },
//     { id: 2, eventName: "Summer Jazz Night", userEmail: "sarah.m@example.com", username: "sarah_m", status: "Pending", tickets: 1, date: "2024-06-10", amount: 45.00 },
//     { id: 3, eventName: "UX Design Workshop", userEmail: "kevin.k@example.com", username: "kev_k", status: "Confirmed", tickets: 1, date: "2024-05-20", amount: 120.00 },
//     { id: 4, eventName: "Global Food Festival", userEmail: "maria.g@example.com", username: "maria_g", status: "Cancelled", tickets: 4, date: "2024-07-02", amount: 0.00 },
//     { id: 5, eventName: "Tech Frontier 2024", userEmail: "david.w@example.com", username: "dwilson", status: "Confirmed", tickets: 3, date: "2024-05-15", amount: 375.00 },
//     { id: 6, eventName: "Product Launch Gala", userEmail: "emma.s@example.com", username: "emma_s", status: "Confirmed", tickets: 2, date: "2024-08-12", amount: 500.00 },
//     { id: 7, eventName: "Digital Marketing Summit", userEmail: "james.l@example.com", username: "james_l", status: "Pending", tickets: 1, date: "2024-09-05", amount: 89.00 },
//     { id: 8, eventName: "Summer Jazz Night", userEmail: "linda.t@example.com", username: "linda_t", status: "Confirmed", tickets: 2, date: "2024-06-10", amount: 90.00 },
//   ];

//   const filteredData = useMemo(() => {
//     return MOCK_DATA.filter(item =>
//       item.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [searchTerm]);

//   const getStatusBadge = (status) => {
//     const base = "px-3 py-1.5 rounded-lg text-[11px] font-bold flex items-center gap-2 w-fit uppercase tracking-tighter shadow-sm";
//     switch (status) {
//       case 'Confirmed':
//         return <span className={`${base} bg-[#C9F7F5] text-[#1BC5BD]`}><CheckCircle2 size={12} /> Confirmed</span>;
//       case 'Pending':
//         return <span className={`${base} bg-[#FFF4DE] text-[#FFA800]`}><Clock size={12} /> Pending</span>;
//       case 'Cancelled':
//         return <span className={`${base} bg-[#FFE2E5] text-[#F64E60]`}><XCircle size={12} /> Cancelled</span>;
//       default:
//         return status;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#F3F6F9] flex font-sans text-slate-900">
//       <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed}/>

//       <div className="flex-1 flex flex-col min-w-0">
//       <AdminNavbar  collapsed={collapsed} />

//         <main className="p-8">
//           <div className="max-w-7xl mx-auto space-y-6">
//             {/* Stats Overview */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
//               <StatCard title="Total Events" value="2,340" icon={CalendarDays} iconBg="bg-[#E1F0FF]" iconColor="text-[#3699FF]" />
//               <StatCard title="Active Events" value="184" icon={Clock} iconBg="bg-[#C9F7F5]" iconColor="text-[#1BC5BD]" />
//               <StatCard title="Total Revenue" value="$45,820" icon={DollarSign} iconBg="bg-[#FFF4DE]" iconColor="text-[#FFA800]" />
//               <StatCard title="Total Registrations" value="8,122" icon={Users} iconBg="bg-[#FFE2E5]" iconColor="text-[#F64E60]" />
//             </div>

//             {/* Table Container */}
//             <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
//               <div className="px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                   <h2 className="text-lg font-black text-[#464E5F] tracking-tighter">Registration Data</h2>
//                   <p className="text-xs text-[#B5B5C3] font-bold uppercase tracking-widest mt-1">Real-time update</p>
//                 </div>
//                 <div className="flex gap-2">
//                   <div className="relative">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B5B5C3]" size={14} />
//                     <input
//                       type="text"
//                       placeholder="Search table..."
//                       className="pl-9 pr-4 py-2 bg-[#F3F6F9] rounded-lg text-xs font-bold outline-none w-full sm:w-48"
//                       value={searchTerm}
//                       onChange={(e) => setSearchTerm(e.target.value)}
//                     />
//                   </div>
//                   <button className="p-2.5 bg-[#F3F6F9] text-[#3699FF] rounded-lg hover:bg-[#3699FF] hover:text-white transition-all">
//                     <Download size={16} />
//                   </button>
//                   <button className="flex items-center px-5 py-2.5 bg-[#3699FF] text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-[#187DE4] transition-all shadow-lg shadow-blue-200">
//                     Export Report
//                   </button>
//                 </div>
//               </div>

//               <div className="overflow-x-auto px-4">
//                 <table className="w-full text-left border-collapse mb-4">
//                   <thead>
//                     <tr className="border-b border-gray-100">
//                       <th className="px-4 py-4 text-[11px] font-black text-[#B5B5C3] uppercase tracking-widest">Event Name</th>
//                       <th className="px-4 py-4 text-[11px] font-black text-[#B5B5C3] uppercase tracking-widest">Email Address</th>
//                       <th className="px-4 py-4 text-[11px] font-black text-[#B5B5C3] uppercase tracking-widest text-center">Tickets</th>
//                       <th className="px-4 py-4 text-[11px] font-black text-[#B5B5C3] uppercase tracking-widest">Status</th>
//                       <th className="px-4 py-4 text-[11px] font-black text-[#B5B5C3] uppercase tracking-widest">Date</th>
//                       <th className="px-4 py-4 text-[11px] font-black text-[#B5B5C3] uppercase tracking-widest text-right">Amount</th>
//                       <th className="px-4 py-4"></th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-50">
//                     {filteredData.map((item) => (
//                       <tr key={item.id} className="hover:bg-[#F3F6F9] transition-colors group">
//                         <td className="px-4 py-5 whitespace-nowrap">
//                           <div className="font-black text-[#464E5F] text-[13px] group-hover:text-[#3699FF] transition-colors">{item.eventName}</div>
//                           <div className="text-[11px] text-[#B5B5C3] font-bold">User: {item.username}</div>
//                         </td>
//                         <td className="px-4 py-5 whitespace-nowrap text-[#464E5F] text-[13px] font-bold">{item.userEmail}</td>
//                         <td className="px-4 py-5 whitespace-nowrap text-center">
//                           <span className="px-3 py-1 bg-[#F3F6F9] rounded-lg text-xs font-black text-[#3699FF]">{item.tickets}</span>
//                         </td>
//                         <td className="px-4 py-5 whitespace-nowrap">{getStatusBadge(item.status)}</td>
//                         <td className="px-4 py-5 whitespace-nowrap text-[11px] font-black text-[#B5B5C3] uppercase">
//                           {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
//                         </td>
//                         <td className="px-4 py-5 whitespace-nowrap text-right font-black text-[13px] text-[#464E5F]">
//                           ${item.amount.toLocaleString()}
//                         </td>
//                         <td className="px-4 py-5 whitespace-nowrap text-right">
//                           <button className="text-[#B5B5C3] hover:text-[#3699FF] p-2 bg-transparent hover:bg-white rounded-lg transition-all">
//                             <MoreVertical size={16} />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               <Pagination totalItems={42} itemsPerPage={10} currentPage={1} />
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default EventReport;

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
import { DataTableEvent } from "../../components/reusable/EventReport.jsx";
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

      const { data } = await adminApi.get("/admin/event/report", {
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
        setDonations(data.events);
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
        const res = await adminApi.get("/admin/events/report/stats");
        console.log("data",res.data.data)
        if (res.data.success) {
          setStats({
            TotalEvents: res.data.data.TotalEvents,
            TotalActiveEvents: res.data.data.TotalActiveEvents,
            TotalRegistrations: res.data.data.TotalRegistrations,
            TotalRevenue: res.data.data.TotalRevenue,
          });
        }
      } catch (err) {
        console.error("Stats load error:", err);
      }
    }

    loadStats();
  }, []);

  console.log(donations);
  console.log("Fetched from backend:", donations.length);

  const handleExport = async () => {
    try {
      const response = await adminApi.get(`/admin/events/report/export`, {
        params: {
          search,
          event: campaignFilter,
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
      link.setAttribute("download", "Events_report.csv");
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
              icon={Calendar}
              title={"Total Events"}
              value={stats.TotalEvents}
              color={"text-emerald-500"}
              bg={"bg-emerald-50"}
            />

            <StatsCardReport
              icon={Users}
              title={"Active Events"}
              value={stats.TotalActiveEvents}
              color={"text-emerald-600"}
              bg={"bg-emerald-50"}
            />

            <StatsCardReport
              icon={HandHeart}
              title={"Total Registrations"}
              value={stats.TotalRegistrations}
              color={"text-emerald-700"}
              bg={"bg-emerald-50"}
            />

            <StatsCardReport
              icon={DollarSign}
              title={"Total Revenue"}
              value={stats.TotalRevenue}
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
          <DataTableEvent item={donations} loading={loading} />

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
