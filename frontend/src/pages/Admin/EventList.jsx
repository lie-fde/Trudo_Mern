import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AdminNavbar from "../../components/Admin/AdminNavbar";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllCampaigns } from "../../store/campaignSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { blockCampaign , unblockCampaign ,deleteCampaign } from "../../services/adminService";

export default function EventsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate()

  // Frontend State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("latest");
  const [page, setPage] = useState(1);

  const ITEMS_PER_PAGE = 6;

  // Fetch campaigns once
  useEffect(() => {
    dispatch(fetchAllCampaigns());
  }, [dispatch]);

  const { campaigns, loading } = useSelector((state) => state.campaign);

  
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

        // API CALLS
        if (!isBlocked) {
          await blockCampaign(campaignId);     // You implement this API
        } else {
          await unblockCampaign(campaignId);   // You implement this API
        }

        // SUCCESS POPUP
        Swal.fire({
          title: isBlocked ? "unblocked!" : "Blocked!",
          text: isBlocked
            ? "Campaign has been listed successfully."
            : "Campaign has been blocked successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        dispatch(fetchAllCampaigns())

      } catch (err) {
        Swal.fire("Error", "Failed to update campaign status", "error");
      }
    }
  });
};

const handleDeleteCampaign = (campaignId) => {
  Swal.fire({
    title: "Delete this campaign?",
    text: "Once deleted, you cannot recover this campaign. This action is permanent.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#e11d48", // red
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {

        await deleteCampaign(campaignId); 
        Swal.fire({
          title: "Deleted!",
          text: "Campaign has been removed successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        // REFRESH LIST
        dispatch(fetchAllCampaigns());

      } catch (err) {
        Swal.fire("Error", "Failed to delete campaign", "error");
      }
    }
  });
};

  let filtered = campaigns.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );


  if (category) {
    filtered = filtered.filter((item) => item.category === category);
  }

  if (sort === "amountDesc") {
    filtered = filtered.sort((a, b) => b.targetAmount - a.targetAmount);
  }
  if (sort === "amountAsc") {
    filtered = filtered.sort((a, b) => a.targetAmount - b.targetAmount);
  }
  if (sort === "latest") {
    filtered = filtered.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }

  // 4️⃣ PAGINATION
  const totalDocs = filtered.length;
  const totalPages = Math.ceil(totalDocs / ITEMS_PER_PAGE);

  const paginatedCampaigns = filtered.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleDelete = (id) => {
    console.log("Delete", id);
  };

  const handleToggleList = (id, currentStatus) => {
    console.log("Toggle", id, currentStatus);
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      {/* SIDEBAR */}
      <div className="w-64 fixed h-full z-10 hidden md:block shadow-xl">
        <AdminSidebar />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        <AdminNavbar />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="text-sm text-gray-500 mb-6">
            <span>Dashboard</span> <span className="mx-2">&gt;</span>
            <span className="text-black font-semibold">Campaigns</span>
          </div>

          {/* Header + Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-6 w-full md:w-auto">
              <h1 className="text-3xl font-extrabold border-b-4 border-black pb-1">
                Events
              </h1>

              <div className="relative flex-1 md:flex-none">
                <input
                  type="text"
                  placeholder="Search donations..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="pl-10 pr-4 py-2.5 border border-gray-300 rounded-full w-full md:w-72 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-all"
                />
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <button onClick={()=>navigate('/admin/create-event')}
            className="bg-black text-white px-6 py-2.5 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition-colors shadow-lg">
              Add New Event <Plus size={18} strokeWidth={3}  />
            </button>
          </div>

          {/* Filter + Sort */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            {/* Filter */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-full px-5 py-2.5 bg-white shadow-sm">
              <span className="font-bold text-sm">Filter By</span>
              <div className="h-4 w-px bg-gray-300 mx-3"></div>

              <select
                className="text-sm outline-none bg-transparent font-medium text-gray-700 cursor-pointer"
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setPage(1);
                }}
              >
                <option value="">All</option>
                <option value="Education">Education</option>
                <option value="Health">Health</option>
                <option value="Disaster Relief">Disaster Relief</option>
                <option value="Others">Others</option>
              </select>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 border border-gray-200 rounded-full px-5 py-2.5 bg-white shadow-sm">
              <span className="font-bold text-sm">Sort</span>
              <div className="h-4 w-px bg-gray-300 mx-3"></div>

              <button
                onClick={() => setSort("amountDesc")}
                className={`text-sm ${
                  sort === "amountDesc"
                    ? "font-bold text-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                Amount High - Low
              </button>

              <button
                onClick={() => setSort("amountAsc")}
                className={`text-sm ml-3 ${
                  sort === "amountAsc"
                    ? "font-bold text-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                Amount Low - High
              </button>

              <button
                onClick={() => setSort("latest")}
                className={`text-sm ml-3 ${
                  sort === "latest"
                    ? "font-bold text-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                Latest
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full min-w-[800px]">
              <thead className="bg-black text-white">
                <tr>
                  <th className="py-5 px-6 text-left text-sm">Image</th>
                  <th className="py-5 px-6 text-left text-sm">Campaign Name</th>
                  <th className="py-5 px-6 text-left text-sm">Category</th>
                  <th className="py-5 px-6 text-center text-sm">List</th>
                  <th className="py-5 px-6 text-center text-sm">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-500">
                      Loading data...
                    </td>
                  </tr>
                ) : paginatedCampaigns.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-12 text-gray-500">
                      No results found
                    </td>
                  </tr>
                ) : (
                  paginatedCampaigns.map((item) => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="py-4 px-6">
                        <div className="w-12 h-12 rounded-xl bg-blue-900 flex items-center justify-center overflow-hidden">
                          <img
                            src={
                              Array.isArray(item.image)
                                ? item.image[0]
                                : item.image
                            }
                            alt="campaign"
                            className="w-10 h-10 object-cover"
                          />
                        </div>
                      </td>

                      <td
  className="py-4 px-6 font-semibold text-gray-800 underline cursor-pointer hover:text-blue-600 transition"
  onClick={() => navigate(`/admin/campaigns-request/${item._id}`)}
>
  {item.title}
</td>

                      <td className="py-4 px-6 text-gray-600">
                        {item.category}
                      </td>

                      <td className="py-4 px-6 text-center">


                        <button
                        onClick={() => handleBlockCampaign(item._id, item.isBlocked)}
                        className={`px-4 py-1 rounded-full text-sm font-medium ${
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
                          <button onClick={()=>navigate(`/admin/campaigns/edit/${item._id}`)}
                          className="p-2 border rounded-lg hover:bg-gray-100 text-gray-600">
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCampaign(item._id)}
                            className="p-2 border border-red-200 rounded-lg hover:bg-red-50 text-red-500"
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

          {/* Pagination */}
          <div className="flex justify-between items-center mt-8 text-sm text-gray-500">
            <p>
              Showing{" "}
              <span className="text-black">
                {(page - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              -{" "}
              <span className="text-black">
                {Math.min(page * ITEMS_PER_PAGE, totalDocs)}
              </span>{" "}
              of <span className="text-black">{totalDocs}</span>
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg"
              >
                <ChevronLeft size={18} />
              </button>

              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-9 h-9 rounded-lg ${
                    page === i + 1
                      ? "bg-black text-white"
                      : "bg-gray-50 text-gray-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg"
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
