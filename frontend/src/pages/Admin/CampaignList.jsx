import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
} from "lucide-react";
import AdminNavbar from "../../components/Admin/AdminNavbar";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCampaigns } from "../../store/campaignSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  blockCampaign,
  unblockCampaign,
  deleteCampaign,
} from "../../services/adminService";

export default function CampaignsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Frontend State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);
  const [collapsed, setCollapsed] = useState(window.innerWidth < 768);

  const ITEMS_PER_PAGE = 6;

  // Fetch campaigns on load
  useEffect(() => {
    dispatch(fetchAllCampaigns());
  }, [dispatch]);

  const { campaigns, loading } = useSelector((state) => state.campaign);

  // Logic for Block/Unblock
  const handleBlockCampaign = (campaignId, isBlocked) => {
    Swal.fire({
      title: isBlocked ? "Unlist this campaign?" : "Block this campaign?",
      text: isBlocked
        ? "This campaign will no longer be blocked and will be visible again."
        : "This campaign will be blocked and hidden from users.",
      icon: isBlocked ? "info" : "warning",
      showCancelButton: true,
      confirmButtonColor: isBlocked ? "#16a34a" : "#f59e0b",
      cancelButtonColor: "#3085d6",
      confirmButtonText: isBlocked
        ? "Yes, unlist campaign"
        : "Yes, block campaign",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          if (!isBlocked) {
            await blockCampaign(campaignId);
          } else {
            await unblockCampaign(campaignId);
          }
          Swal.fire({
            title: isBlocked ? "Unblocked!" : "Blocked!",
            text: isBlocked ? "Listed successfully." : "Blocked successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          dispatch(fetchAllCampaigns());
        } catch (err) {
          Swal.fire("Error", "Failed to update status", "error");
        }
      }
    });
  };

  // Logic for Delete
  const handleDeleteCampaign = (campaignId) => {
    Swal.fire({
      title: "Delete this campaign?",
      text: "This action is permanent.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e11d48",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteCampaign(campaignId);
          Swal.fire({
            title: "Deleted!",
            text: "Campaign removed successfully.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          dispatch(fetchAllCampaigns());
        } catch (err) {
          Swal.fire("Error", "Failed to delete campaign", "error");
        }
      }
    });
  };

  // Filter & Sort Processing
  let filtered = campaigns.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  if (category) {
    filtered = filtered.filter((item) => item.category === category);
  }

  if (sort === "amountDesc") {
    filtered = [...filtered].sort((a, b) => b.targetAmount - a.targetAmount);
  } else if (sort === "amountAsc") {
    filtered = [...filtered].sort((a, b) => a.targetAmount - b.targetAmount);
  } else if (sort === "latest") {
    filtered = [...filtered].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  // Pagination Logic
  const totalDocs = filtered.length;
  const totalPages = Math.ceil(totalDocs / ITEMS_PER_PAGE);
  const paginatedCampaigns = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      {/* SIDEBAR */}
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* MAIN CONTENT */}
      <div
        className={`flex-1 flex flex-col h-screen overflow-hidden transition-all duration-300 ${
          collapsed ? "md:ml-20" : "md:ml-64"
        }`}
      >
        <AdminNavbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 mt-16">
          {/* Breadcrumb */}
          <div className="text-sm text-gray-500 mb-6 hidden sm:block">
            <span>Dashboard</span> <span className="mx-2">&gt;</span>
            <span className="text-black font-semibold">Campaigns</span>
          </div>

          {/* Header + Search */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
              <h1 className="text-2xl md:text-3xl font-extrabold border-b-4 border-black pb-1">
                Campaigns
              </h1>
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-full focus:ring-2 focus:ring-gray-200 outline-none transition-all"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <button
              onClick={() => navigate("/admin/create-campaign")}
              className="bg-black text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-800 transition shadow-lg w-full sm:w-auto"
            >
              Add New Campaign <Plus size={18} strokeWidth={3} />
            </button>
          </div>

          {/* Filter + Sort Container */}
          <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-4">
            <div className="flex items-center gap-2 border border-gray-200 rounded-full px-5 py-2.5 bg-white shadow-sm w-full sm:w-auto">
              <span className="font-bold text-sm whitespace-nowrap">
                Filter By
              </span>
              <div className="h-4 w-px bg-gray-300 mx-3"></div>
              <select
                className="text-sm outline-none bg-transparent font-medium text-gray-700 cursor-pointer w-full"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All Categories</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Disaster Relief">Disaster Relief</option>
                <option value="Others">Others</option>
              </select>
            </div>

            <div className="flex items-center gap-3 border border-gray-200 rounded-xl sm:rounded-full px-5 py-2.5 bg-white shadow-sm overflow-x-auto no-scrollbar w-full sm:w-auto">
              <span className="font-bold text-sm">Sort</span>
              <div className="h-4 w-px bg-gray-300 mx-1"></div>
              <div className="flex gap-4">
                <button
                  onClick={() => setSort("amountDesc")}
                  className={`text-sm whitespace-nowrap ${
                    sort === "amountDesc"
                      ? "font-bold text-black"
                      : "text-gray-500"
                  }`}
                >
                  Amount High-Low
                </button>
                <button
                  onClick={() => setSort("amountAsc")}
                  className={`text-sm whitespace-nowrap ${
                    sort === "amountAsc"
                      ? "font-bold text-black"
                      : "text-gray-500"
                  }`}
                >
                  Amount Low-High
                </button>
                <button
                  onClick={() => setSort("latest")}
                  className={`text-sm whitespace-nowrap ${
                    sort === "latest" ? "font-bold text-black" : "text-gray-500"
                  }`}
                >
                  Latest
                </button>
              </div>
            </div>
          </div>

          {/* CONTENT SECTION (Table/Card) */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* DESKTOP TABLE */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="py-5 px-6 text-left text-sm uppercase tracking-wider">
                      Image
                    </th>
                    <th className="py-5 px-6 text-left text-sm uppercase tracking-wider">
                      Campaign Name
                    </th>
                    <th className="py-5 px-6 text-left text-sm uppercase tracking-wider">
                      Category
                    </th>
                    <th className="py-5 px-6 text-center text-sm uppercase tracking-wider">
                      List Status
                    </th>
                    <th className="py-5 px-6 text-center text-sm uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-12 text-gray-500"
                      >
                        Loading data...
                      </td>
                    </tr>
                  ) : paginatedCampaigns.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-12 text-gray-500"
                      >
                        No results found
                      </td>
                    </tr>
                  ) : (
                    paginatedCampaigns.map((item) => (
                      <tr
                        key={item._id}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="py-4 px-6">
                          <img
                            src={
                              Array.isArray(item.image)
                                ? item.image[0]
                                : item.image
                            }
                            className="w-12 h-12 rounded-xl object-cover border"
                            alt=""
                          />
                        </td>
                        <td className="py-4 px-6 font-semibold text-gray-800">
                          <span
                            className="underline cursor-pointer hover:text-blue-600 transition"
                            onClick={() =>
                              navigate(`/admin/campaigns-request/${item._id}`)
                            }
                          >
                            {item.title}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-gray-600">
                          {item.category}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() =>
                              handleBlockCampaign(item._id, item.isBlocked)
                            }
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                              item.isBlocked
                                ? "bg-green-600 text-white"
                                : "bg-red-600 text-white"
                            }`}
                          >
                            {item.isBlocked ? "UNBLOCK" : "BLOCK"}
                          </button>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex justify-center gap-3">
                            <button
                              onClick={() =>
                                navigate(`/admin/campaigns/edit/${item._id}`)
                              }
                              className="p-2 border rounded-lg hover:bg-gray-100 text-gray-600 transition"
                            >
                              <Edit size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteCampaign(item._id)}
                              className="p-2 border border-red-100 rounded-lg hover:bg-red-50 text-red-500 transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARD VIEW */}
            <div className="md:hidden divide-y divide-gray-100">
              {loading ? (
                <div className="text-center py-12 text-gray-500">
                  Loading...
                </div>
              ) : paginatedCampaigns.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No campaigns found
                </div>
              ) : (
                paginatedCampaigns.map((item) => (
                  <div key={item._id} className="p-4 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={
                          Array.isArray(item.image) ? item.image[0] : item.image
                        }
                        className="w-16 h-16 rounded-xl object-cover border"
                        alt=""
                      />
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-bold text-gray-900 truncate"
                          onClick={() =>
                            navigate(`/admin/campaigns-request/${item._id}`)
                          }
                        >
                          {item.title}
                        </h3>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <button
                        onClick={() =>
                          handleBlockCampaign(item._id, item.isBlocked)
                        }
                        className={`px-4 py-1.5 rounded-full text-[10px] font-bold ${
                          item.isBlocked
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {item.isBlocked ? "UNBLOCK" : "BLOCK"}
                      </button>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            navigate(`/admin/campaigns/edit/${item._id}`)
                          }
                          className="p-2 border rounded-lg text-gray-600"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteCampaign(item._id)}
                          className="p-2 border border-red-100 rounded-lg text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 gap-4 text-sm text-gray-500">
            <p>
              Showing {Math.min(paginatedCampaigns.length, totalDocs)} of{" "}
              {totalDocs} campaigns
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center bg-white border rounded-lg disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-9 h-9 rounded-lg font-bold ${
                      page === i + 1
                        ? "bg-black text-white"
                        : "bg-white border text-gray-600"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="w-9 h-9 flex items-center justify-center bg-white border rounded-lg disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
