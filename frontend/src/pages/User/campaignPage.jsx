import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import Navbar from "../../components/User/Navbar.jsx";
import { useSelector, useDispatch } from "react-redux";
import { fetchPublicCampaigns } from "../../store/campaignUserSlice.js";
import Trudofooter from "../../components/reusable/footer";
import { useNavigate } from "react-router-dom";
import CTABanner from "../../components/User/CTABanner.jsx";

const CampaignCard = ({ campaign }) => {
  const progress =
    campaign.raisedAmount && campaign.targetAmount
      ? Math.min((campaign.raisedAmount / campaign.targetAmount) * 100, 100)
      : 0;

  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition cursor-pointer max-w-[340px] w-full mx-auto flex flex-col"
      onClick={() => navigate(`/campaigns/${campaign._id}`)}
    >
      <div className="h-44 overflow-hidden rounded-t-xl">
        <img
          src={campaign.image?.[0] || "/placeholder.png"}
          alt={campaign.title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-[15px] font-semibold text-gray-800 mb-3 line-clamp-2 h-10">
          {campaign.title}
        </h3>

        <div className="text-xs text-gray-500 space-y-3 mt-auto">
          <div className="flex justify-between items-end">
            <span>Raised</span>
            <span className="font-semibold text-gray-700 text-sm">
              {progress.toFixed(0)}%
            </span>
          </div>

          <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-orange-500 h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="flex justify-between items-center pt-1">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Target</p>
              <p className="font-bold text-gray-900 text-sm">
                ₹ {campaign.targetAmount?.toLocaleString()}
              </p>
            </div>
              <div>
              <p className="text-xs text-gray-400 mb-0.5">Raised</p>
              <p className="font-bold text-gray-900 text-sm">
                ₹ {campaign.raisedAmount?.toLocaleString()}
              </p>
            </div>


            <div className="text-right">
              <p className="text-xs text-gray-400 mb-0.5">Created</p>
              <p className="text-orange-500 font-medium">
                {new Date(campaign.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function CampaignPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState("created_desc");
  const [currentPage, setCurrentPage] = useState(1);

  const { campaigns, totalPages, loading } = useSelector(
    (state) => state.campaignPublic
  );

  // Fetch campaigns when search, pagination, or sort changes
  useEffect(() => {
    dispatch(
      fetchPublicCampaigns({
        page: currentPage,
        limit: 6,
        search: searchTerm,
        sort,
      })
    );
  }, [dispatch, searchTerm, currentPage, sort]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      <Navbar />

      <div className="pt-24 max-w-7xl mx-auto px-5 w-full flex-grow pb-0 mb-0">
        {/* Search + Sort Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-10">
          {/* Search */}
          <div className="relative w-full md:w-2/3 lg:w-1/2">
            <input
              type="text"
              placeholder="Search by name, fundraiser..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-3 pl-12 pr-4 bg-white border border-gray-200 rounded-full shadow-sm focus:ring-2 focus:ring-orange-100 focus:border-orange-500 focus:outline-none transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>

          {/* Sorting Dropdown */}
          <select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setCurrentPage(1);
            }}
            className="px-8 py-3 bg-white border border-gray-200 rounded-full shadow-sm hover:bg-gray-50 hover:border-gray-300 transition cursor-pointer text-gray-700 font-medium"
          >
            <option value="created_desc">Newest First</option>
            <option value="created_asc">Oldest First</option>
            <option value="highest_raised">Highest Raised</option>
            <option value="lowest_raised">Lowest Raised</option>
          </select>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="flex justify-center items-center py-32">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : (
          <>
            {/* Campaign Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center mb-12">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign._id} campaign={campaign} />
              ))}
              {campaigns.length === 0 && (
                <div className="col-span-full text-center py-20 text-gray-500">
                  No campaigns found.
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-12 mb-16 space-x-2 text-gray-700 select-none">
                <button
                  onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  &lt;
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      onClick={() => handlePageChange(number)}
                      className={`w-10 h-10 flex items-center justify-center rounded-full transition-all font-medium ${
                        currentPage === number
                          ? "bg-orange-500 text-white shadow-md transform scale-105"
                          : "hover:bg-gray-100 hover:text-black text-gray-600"
                      }`}
                    >
                      {number}
                    </button>
                  )
                )}

                <button
                  onClick={() =>
                    handlePageChange(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  &gt;
                </button>
              </div>
            )}
          </>
        )}

        <CTABanner />
      </div>

      <Trudofooter />
    </div>
  );
}

