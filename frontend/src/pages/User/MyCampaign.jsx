// import React, { useEffect, useState } from "react";
// import { Mail, Search, Menu, User } from 'lucide-react';
// import Navbar from "../../components/User/Navbar.jsx"
// import { useSelector,useDispatch } from "react-redux";
// import { fetchMycampaign } from "../../store/campaignUserSlice.js";
// import Trudofooter from "../../components/reusable/footer";
// import { useNavigate } from "react-router-dom";

// const CampaignCard = ({ campaign }) => {
//   // Calculate progress if your backend sends: raisedAmount & targetAmount
//   const progress = 55
//     // campaign.raisedAmount && campaign.targetAmount
//     //   ? Math.min((campaign.raisedAmount / campaign.targetAmount) * 100, 100)
//     //   : 0;

//     const navigate = useNavigate()
//   return (
//     <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition cursor-pointer max-w-[340px] w-full mx-auto flex flex-col"
//     onClick={()=>navigate(`/campaigns/${campaign._id}`)}
//     >

//    <div className="h-44 overflow-hidden rounded-t-xl">
//   <img
//     src={campaign.image?.[0] || "/placeholder.png"}
//     alt={campaign.title}
//     className="w-full h-full object-cover"
//   />
// </div>

//       {/* CONTENT */}
//       <div className="p-4 flex-1 flex flex-col">

//         {/* TITLE */}
//         <h3 className="text-[15px] font-semibold text-gray-800 mb-3 line-clamp-2 h-10">
//           {campaign.title}
//         </h3>

//         <div className="text-xs text-gray-500 space-y-3 mt-auto">

//           {/* RAISED PROGRESS */}
//           <div className="flex justify-between items-end">
//             <span>Raised</span>
//             <span className="font-semibold text-gray-700 text-sm">
//               {progress.toFixed(0)}%
//             </span>
//           </div>

//           <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
//             <div
//               className="bg-orange-500 h-1.5 rounded-full transition-all duration-500 ease-out"
//               style={{ width: `${progress}%` }}
//             ></div>
//           </div>

//           {/* TARGET + CREATED */}
//           <div className="flex justify-between items-center pt-1">
//             <div>
//               <p className="text-xs text-gray-400 mb-0.5">Target</p>
//               <p className="font-bold text-gray-900 text-sm">
//                 ₹ {campaign.targetAmount?.toLocaleString()}
//               </p>
//             </div>

//             <div className="text-right">
//               <p className="text-xs text-gray-400 mb-0.5">Created</p>
//               <p className="text-orange-500 font-medium">
//                 {new Date(campaign.createdAt).toLocaleDateString()}
//               </p>
//             </div>
//           </div>

//         </div>
//       </div>
//     </div>
//   );
// };


// export default function MyCampaignPage() {
//   // Switched to local state for preview purposes since Redux is not available


//  const dispatch = useDispatch();
//  let itemsPerPage = 6

//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredCampaigns, setFilteredCampaigns] = useState([]);
//   const [currentPage , setCurrentPage] = useState(1)

//   const { myCampaign, loading } = useSelector(
//     (state) => state.campaignPublic
//   );

//   useEffect(() => {
//     dispatch(fetchMycampaign());
//   }, [dispatch]);

//   useEffect(() => {
//     if (myCampaign) {
//       const results = myCampaign.filter((campaign) =>
//         campaign.title?.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredCampaigns(results);
//     }
//   }, [myCampaign, searchTerm]);




//   // Logic for displaying current campaigns
//   const displayData = filteredCampaigns.length || searchTerm ? filteredCampaigns : myCampaign;
//   const totalPages = Math.ceil(displayData.length / itemsPerPage);
  
//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentCampaigns = displayData.slice(indexOfFirstItem, indexOfLastItem);

//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   };

//   return (
//     <div className="bg-white min-h-screen flex flex-col font-sans">
      
//       {/* NAVBAR */}
//       <Navbar/>

//       {/* Main Content Area - Removed large bottom padding */}
//       <div className="pt-24 max-w-7xl mx-auto px-5 w-full flex-grow pb-0 mb-0">

//         {/* Search + Filter */}
//         <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
//           <div className="relative w-full md:w-2/3 lg:w-1/2">
//             <input
//               type="text"
//               placeholder="Search by name, fundraiser..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full py-3 pl-12 pr-4 bg-white border border-gray-200 rounded-full shadow-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 focus:outline-none transition-all"
//             />
//             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
//           </div>

//           <button className="px-8 py-3 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 hover:border-gray-300 transition flex items-center text-gray-700 font-medium">
//             <span className="mr-2">⚙️</span> Filter
//           </button>
//         </div>

//         {/* Campaign Grid */}
//         {loading ? (
//           <div className="flex justify-center items-center py-32">
//              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
//           </div>
//         ) : (
//           <>
//             {/* Grid Layout: Justify items center handles the spacing cleanly */}
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mb-12">
//               {currentCampaigns.map((campaign) => (
//                 <CampaignCard key={campaign._id} campaign={campaign} />
                
//               )
              
//               )}
//               {currentCampaigns.length === 0 && (
//                 <div className="col-span-full text-center py-20 text-gray-500">
//                   No campaigns found matching your search.
//                 </div>
//               )}
//             </div>

//             {/* Pagination Controls */}
//             {totalPages > 1 && (
//               <div className="flex justify-center items-center mt-12 mb-16 space-x-2 text-gray-700 select-none">
//                 <button 
//                   onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
//                   disabled={currentPage === 1}
//                   className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                 >
//                   &lt;
//                 </button>
                
//                 {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
//                   <button
//                     key={number}
//                     onClick={() => handlePageChange(number)}
//                     className={`w-10 h-10 flex items-center justify-center rounded-full transition-all font-medium ${
//                       currentPage === number 
//                         ? 'bg-orange-500 text-white shadow-md transform scale-105' 
//                         : 'hover:bg-gray-100 hover:text-black text-gray-600'
//                     }`}
//                   >
//                     {number}
//                   </button>
//                 ))}

//                 <button 
//                   onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
//                   disabled={currentPage === totalPages}
//                   className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
//                 >
//                   &gt;
//                 </button>
//               </div>
//             )}
//           </>
//         )}

//         {/* Raise Funds Banner - Reduced margins slightly */}
//         <div className="my-12 py-10 px-8 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-center text-center md:text-left">
//           <div>
//             <p className="text-xl font-bold text-gray-800 mb-2">
//               Facing an emergency?
//             </p>
//             <p className="text-gray-500">We connect you with trusted foundations to help you raise funds quickly.</p>
//           </div>
//           <button className="mt-6 md:mt-0 px-8 py-3 bg-orange-600 text-white font-medium rounded-full hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all transform hover:-translate-y-0.5">
//             Connect a Foundation
//           </button>
//         </div>

        

//       </div>

//       {/* Footer Component */}
//       <Trudofooter />
//     </div>
//   );
// }


import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  PlusCircle, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  PauseCircle, 
  Edit,
  Eye,
  Trash2,
  TrendingUp,
  Heart,
  Menu,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/User/Navbar.jsx";
import Trudofooter from "../../components/reusable/footer";
import { useSelector, useDispatch } from "react-redux";
import { fetchMycampaign } from "../../store/campaignUserSlice.js";
import campaign from "../../../../backend/models/campaign.js";

// ==================================================================================
// 3. MAIN DASHBOARD LOGIC
// ==================================================================================

// --- Helper: Status Badge ---
const StatusBadge = ({ status }) => {
  switch (status) {
    case "approved":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
          <CheckCircle2 size={14} /> Live
        </span>
      );
    case "pending":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
          <AlertCircle size={14} /> Pending
        </span>
      );
    case "rejected":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
          <XCircle size={14} /> Rejected
        </span>
      );
    case "disabled":
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
          <PauseCircle size={14} /> Disabled
        </span>
      );
    default:
      return null;
  }
};

// --- Component: Dashboard Campaign Card ---
const DashboardCampaignCard = ({ campaign }) => {
  const navigate = useNavigate();
  
  // Calculate Progress
  const raised = campaign.raisedAmount || 0;
  const target = campaign.targetAmount || 1; // prevent division by zero
  const percentage = Math.min(100, Math.round((raised / target) * 100));

  // Handle Image (Your API returns an array)
  const imageUrl = campaign.image?.[0] || "https://placehold.co/600x400/94A3B8/FFFFFF?text=No+Image";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col md:flex-row">
      {/* Image Section */}
      <div className="w-full md:w-64 h-48 md:h-auto relative bg-gray-100 shrink-0">
        <img
          src={imageUrl}
          alt={campaign.title}
          className={`w-full h-full object-cover ${campaign.status === 'disabled' ? 'grayscale opacity-80' : ''}`}
        />
        <div className="absolute top-3 left-3">
          <StatusBadge status={campaign.status} />
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-900 line-clamp-1">{campaign.title}</h3>
            <p className="text-xs text-gray-500 whitespace-nowrap">
              {new Date(campaign.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{campaign.description}</p>
          
          {/* Admin Note */}
          {campaign.status === "rejected" && campaign.adminNote && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span><strong>Admin Note:</strong> {campaign.adminNote}</span>
            </div>
          )}

          {/* Progress Bar */}
          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold text-gray-700">₹{raised.toLocaleString()}</span>
              <span className="text-gray-500">of ₹{target.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  campaign.status === 'approved' ? 'bg-orange-500' : 'bg-gray-400'
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100 mt-2">
          <button 
            onClick={() => navigate(`/campaigns/${campaign._id}`)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors"
          >
            <Eye size={16} /> View
          </button>
 
          {/* Conditional Buttons based on Status */}
          {(campaign.status === 'Pending' || campaign.status === 'rejected') && (
             <button 
             onClick={() => navigate(`/mycampaigns/edit/${campaign._id}`)}
             className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 border border-blue-200 transition-colors"
           >
             <Edit size={16} /> Edit
           </button>
          )}

          {/* Delete Placeholder (Add logic if needed) */}
          {/* <button className="ml-auto text-gray-400 hover:text-red-500 transition-colors p-2">
             <Trash2 size={18} />
          </button>  */}
          



        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function UserDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 1. State for Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // 2. Fetch Data (Redux)
  const { myCampaign, loading } = useSelector((state) => state.campaignPublic);

  useEffect(() => {
    dispatch(fetchMycampaign());
  }, [dispatch]);

  // 3. Filtering Logic
  const campaigns = myCampaign || [];
  
  const filteredCampaigns = campaigns.filter((campaign) => {
    // Search Filter
    const matchesSearch = campaign.title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status Filter
    const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // 4. Calculate Stats from Real Data
  const stats = {
    totalRaised: campaigns.reduce((acc, curr) => acc + (curr.raisedAmount || 0), 0),
    activeCount: myCampaign.filter(c => c.status === 'Approved').length,
    pendingCount: myCampaign.filter(c => c.status === 'Pending').length,
  };

  return (
    <div className="w-full bg-gray-50 min-h-screen font-sans flex flex-col">
      <Navbar />

      <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-grow">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900">My Dashboard</h1>
            <p className="text-gray-500 mt-1">Manage your fundraising campaigns and track impact.</p>
          </div>
          <button 
            onClick={() => navigate('/create-campaign')}
            className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:-translate-y-0.5"
          >
            <PlusCircle size={20} />
            Start New Campaign
          </button>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Funds Raised</p>
              <h4 className="text-2xl font-bold text-gray-900">₹ {stats.totalRaised.toLocaleString()}</h4>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              <Heart size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Active Campaigns</p>
              <h4 className="text-2xl font-bold text-gray-900">{stats.activeCount}</h4>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Pending Verification</p>
              <h4 className="text-2xl font-bold text-gray-900">{stats.pendingCount}</h4>
            </div>
          </div>
        </div>

        {/* CAMPAIGNS CONTAINER */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 min-h-[500px]">
          
          {/* CONTROLS (TABS & SEARCH) */}
          <div className="p-6 border-b border-gray-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Left: Title + Tabs */}
            <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <LayoutDashboard size={22} className="text-gray-400" />
                My Campaigns
              </h2>

              {/* Status Tabs */}
              <div className="flex p-1 bg-gray-100 rounded-xl overflow-hidden">
                {['all', 'Approved', 'Pending', 'disabled'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setStatusFilter(tab)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      statusFilter === tab 
                        ? 'bg-white text-gray-900 shadow-sm' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Search Bar */}
            <div className="relative w-full lg:w-72">
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-2.5 pl-10 pr-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 focus:outline-none transition-all text-sm"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </div>

          {/* CAMPAIGN LIST */}
          <div className="p-6">
            {loading ? (
               <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
               </div>
            ) : filteredCampaigns.length > 0 ? (
              <div className="space-y-6">
                {filteredCampaigns.map((campaign) => (
                  <DashboardCampaignCard 
                    key={campaign._id} 
                    campaign={campaign} 
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="bg-gray-50 p-6 rounded-full mb-4">
                  <Search size={40} className="text-gray-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">No campaigns found</h3>
                <p className="text-gray-500 max-w-sm mt-2">
                  Try adjusting your search or filters.
                </p>
                {statusFilter === 'all' && !searchTerm && (
                   <button 
                   onClick={() => navigate('/create-campaign')}
                   className="mt-6 text-emerald-600 font-semibold hover:text-emerald-700"
                 >
                   Start a campaign now &rarr;
                 </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Trudofooter />
    </div>
  );
}