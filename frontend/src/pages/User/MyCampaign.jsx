import React, { useState, useEffect, lazy, Suspense } from "react";
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
  TrendingUp,
  Heart,
  Loader,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import Navbar from "../../components/User/Navbar.jsx";
import Trudofooter from "../../components/reusable/footer";
import { useSelector, useDispatch } from "react-redux";
import { fetchMycampaign } from "../../store/campaignUserSlice.js";
import Loaders from "../../components/reusable/loader.jsx";

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
    default:
      return null;
  }
};

const DashboardCampaignCard = ({ campaign }) => {
  const navigate = useNavigate();

  const raised = campaign.raisedAmount || 1;
  const target = campaign.targetAmount || 1;
  const percentage = Math.min(100, Math.round((raised / target) * 100));

  const imageUrl =
    campaign.image?.[0] ||
    "https://placehold.co/600x400/94A3B8/FFFFFF?text=No+Image";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 flex flex-col md:flex-row">
      <div className="w-full md:w-64 h-48 md:h-auto relative bg-gray-100 shrink-0">
        <img
          src={imageUrl}
          alt={campaign.title}
          className={`w-full h-full object-cover ${
            campaign.status === "disabled" ? "grayscale opacity-80" : ""
          }`}
        />
        <div className="absolute top-3 left-3">
          <StatusBadge status={campaign.status} />
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold text-gray-900 line-clamp-1">
                {campaign.title}
              </h3>

              {/* STATUS BADGE */}
              {campaign.status === "Approved" && (
                <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                  Active
                </span>
              )}

              {campaign.status === "Pending" && (
                <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 font-medium">
                  Pending
                </span>
              )}

              {campaign.status === "Rejected" && (
                <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium">
                  Rejected
                </span>
              )}
            </div>

            <p className="text-xs text-gray-500 whitespace-nowrap">
              {new Date(campaign.createdAt).toLocaleDateString()}
            </p>
          </div>

          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {campaign.description}
          </p>

          {campaign.status === "rejected" && campaign.rejectionReason && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100 flex items-start gap-2">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>
                <strong>Admin Note:</strong> {campaign.rejectionReason}
              </span>
            </div>
          )}

          <div className="mb-2">
            <div className="flex justify-between text-sm mb-1">
              <span className="font-semibold text-gray-700">
                ₹{raised.toLocaleString()}
              </span>
              <span className="text-gray-500">
                of ₹{target.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full ${
                  campaign.status === "approved"
                    ? "bg-gray-400"
                    : "bg-orange-500"
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100 mt-2">
          <button
            onClick={() => navigate(`/campaigns/${campaign._id}`)}
            className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 border border-gray-200 transition-colors"
          >
            <Eye size={16} /> View
          </button>

          {campaign.status === "Pending" && (
            <button
              onClick={() => navigate(`/mycampaigns/edit/${campaign._id}`)}
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 border border-blue-200 transition-colors"
            >
              <Edit size={16} /> Edit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default function UserDashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const { myCampaign, loading } = useSelector((state) => state.campaignPublic);

  useEffect(() => {
    dispatch(fetchMycampaign());
  }, [dispatch]);

  const campaigns = myCampaign || [];

  console.log(campaigns);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || campaign.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalRaised: campaigns.reduce(
      (acc, curr) => acc + (curr.raisedAmount || 0),
      0
    ),
    activeCount: myCampaign.filter((c) => c.status === "Approved").length,
    pendingCount: myCampaign.filter((c) => c.status === "Pending").length,
  };

  return (
    <Suspense fallback={<Loaders />}>
      <div className="w-full bg-gray-50 min-h-screen font-sans flex flex-col">
        <Navbar />

        <div className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex-grow">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900">
                My Dashboard
              </h1>
              <p className="text-gray-500 mt-1">
                Manage your fundraising campaigns and track impact.
              </p>
            </div>
            <button
              onClick={() => navigate("/create-campaign")}
              className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <PlusCircle size={20} />
              Start New Campaign
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Total Funds Raised
                </p>
                <h4 className="text-2xl font-bold text-gray-900">
                  ₹ {stats.totalRaised.toLocaleString()}
                </h4>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                <Heart size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Active Campaigns
                </p>
                <h4 className="text-2xl font-bold text-gray-900">
                  {stats.activeCount}
                </h4>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex items-center gap-4">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-full">
                <AlertCircle size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Pending Verification
                </p>
                <h4 className="text-2xl font-bold text-gray-900">
                  {stats.pendingCount}
                </h4>
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
                  {["all", "Approved", "Pending", "Rejected"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setStatusFilter(tab)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                        statusFilter === tab
                          ? "bg-white text-gray-900 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
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
                  <h3 className="text-lg font-bold text-gray-900">
                    No campaigns found
                  </h3>
                  <p className="text-gray-500 max-w-sm mt-2">
                    Try adjusting your search or filters.
                  </p>
                  {statusFilter === "all" && !searchTerm && (
                    <button
                      onClick={() => navigate("/create-campaign")}
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
    </Suspense>
  );
}
