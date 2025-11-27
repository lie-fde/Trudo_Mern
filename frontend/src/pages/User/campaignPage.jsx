import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPublicCampaigns } from "../../store/campaignUserSlice";
import Navbar from "../../components/User/Navbar";

// ---------------- Campaign Card ----------------
const CampaignCard = ({ campaign }) => {
  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition cursor-pointer">
      <div className="h-44 bg-gray-100 flex items-center justify-center">
        <img
          src={campaign.image?.[0] || "/placeholder.png"}
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4">
        <h3 className="text-[15px] font-semibold text-gray-800 mb-2 line-clamp-2">
          {campaign.title}
        </h3>

        <div className="text-xs text-gray-500 space-y-1">
          <div className="flex justify-between">
            <span>Raised by</span>
            <span className="font-semibold text-gray-700">
              {campaign.progress || 77}%
            </span>
          </div>

          <div className="w-full bg-gray-300 h-1.5 rounded-full">
            <div
              className="bg-orange-500 h-1.5 rounded-full"
              style={{ width: `${campaign.progress || 77}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <p className="font-semibold text-gray-900 text-sm">
              ₹ {campaign.targetAmount}
            </p>
            <p className="text-gray-500">
              Created by <span className="text-orange-500">A Foundation</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ---------------- Main Page ----------------
export default function CampaignPage() {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCampaigns, setFilteredCampaigns] = useState([]);

  const { campaigns, loading, error } = useSelector(
    (state) => state.campaignPublic
  );

  useEffect(() => {
    dispatch(fetchPublicCampaigns());
  }, [dispatch]);

  useEffect(() => {
    if (campaigns) {
      const results = campaigns.filter((campaign) =>
        campaign.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCampaigns(results);
    }
  }, [campaigns, searchTerm]);

  return (
    <div className="bg-white min-h-screen">
      
      {/* NAVBAR */}
      <Navbar />

      {/* Page spacing to avoid navbar overlap */}
      <div className="pt-20 max-w-7xl mx-auto px-5 pb-20">

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          <div className="relative w-full md:w-3/4">
            <input
              type="text"
              placeholder="Search by name, fundraiser"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 pl-5 pr-12 bg-white border border-gray-300 rounded-full shadow-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
            />
            <svg
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M15.5 14h-.79l-.28-.27A6.5 6.5 0 1010.5 4a6.5 6.5 0 004.71 11.23l.27.27v.79l4.25 4.25 1.5-1.5L15.5 14z" />
            </svg>
          </div>

          <button className="px-6 py-3 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-100 transition flex items-center">
            <span className="mr-2">⚙️</span> Filter
          </button>
        </div>

        {/* Campaign Grid */}
        {loading ? (
          <p className="text-center text-gray-500">Loading campaigns...</p>
        ) : error ? (
          <p className="text-center text-red-600">Error fetching campaigns</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {(filteredCampaigns.length ? filteredCampaigns : campaigns).map(
              (campaign, index) => (
                <CampaignCard key={campaign._id || index} campaign={campaign} />
              )
            )}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center mt-12 space-x-2 text-gray-700">
          <button className="p-2">&lt;</button>
          <span className="px-4 py-2 bg-orange-500 text-white rounded-full">1</span>
          <button className="px-4 py-2 hover:text-black">2</button>
          <button className="px-4 py-2 hover:text-black">3</button>
          <span>...</span>
          <button className="px-4 py-2 hover:text-black">5</button>
          <button className="p-2">&gt;</button>
        </div>

        {/* Raise Funds Banner */}
        <div className="mt-16 py-8 px-6 bg-gray-100 rounded-2xl shadow flex flex-col md:flex-row justify-between items-center">
          <p className="text-lg font-semibold text-gray-700">
            Do you want to raise funds for an emergency?
          </p>
          <button className="mt-4 md:mt-0 px-6 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition">
            Connect a Foundation
          </button>
        </div>

      </div>
    </div>
  );
}
