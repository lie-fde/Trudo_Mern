import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPendingEvents,
  updateEventStatus,
} from "../../store/eventRequestSlice.js";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import AdminSidebar from "../../components/Admin/AdminSidebar.jsx";
import AdminNavbar from "../../components/Admin/AdminNavbar.jsx";
import { useDebounce } from "../../hooks/debouncehook.jsx";
import { Search } from "lucide-react";

export default function EventRequestList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  const [collapsed, setCollapsed] = useState(false);
  // Track screen size for dynamic sidebar margin
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { events, loading } = useSelector((state) => state.eventRequests);

  useEffect(() => {
    dispatch(fetchPendingEvents({ search :debouncedSearch }));
  }, [dispatch, debouncedSearch]);

  const handleReject = (eventId, userName) => {
    Swal.fire({
      title: "Reject Campaign",
      text: `Please provide a mandatory reason for rejecting ${userName} campaign:`,
      icon: "warning",
      input: "textarea",
      inputLabel: "Rejection Reason (Required)",
      inputPlaceholder: "Enter reason here...",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Submit Rejection",
      inputValidator: (value) => {
        if (!value) {
          return "You must enter a rejection reason!";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const rejectionReason = result.value;

        dispatch(
          updateEventStatus({
            eventId,
            status: "Rejected",
            rejectionReason: rejectionReason,
          }),
        );

        Swal.fire(
          "Rejected!",
          "The campaign request has been rejected and the reason has been logged.",
          "error",
        );

        dispatch(fetchPendingEvents());
      }
    });
  };

  const handleApprove = (eventId, userName) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Do you want to approve the campaign from ${userName}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Approve it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          updateEventStatus({
            eventId,
            status: "Approved",
          }),
        );

        Swal.fire(
          "Approved!",
          "The campaign request has been successfully approved and removed from the list.",
          "success",
        );
        dispatch(fetchPendingEvents());
      }
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen flex">
      {/* FIXED SIDEBAR */}
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* MAIN CONTENT WITH SHIFT */}
      <div
        className="flex-1 transition-all duration-300 w-full"
        style={{
          marginLeft: isMobile ? 0 : collapsed ? 80 : 240, // Responsive Margin Fix
          paddingTop: 72, // navbar height
        }}
      >
        <AdminNavbar collapsed={collapsed} setCollapsed={setCollapsed} />

        <div className="p-4 sm:p-8 mt-1">
          <h1 className="text-2xl sm:text-3xl font-semibold mb-6">
            Event Request
          </h1>
          {/* 
          {loading && <p className="mb-4 text-gray-600">Loading...</p>} */}

          <div className="mb-6 w-full sm:w-80 relative">
            <Search
              size={18}
              className="absolute left-3 top-2.5 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by user name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-1 focus:ring-green-600 outline-none"
            />
          </div>

          <div className="bg-white shadow rounded-xl overflow-hidden">
            {/* Added overflow-x-auto to handle the grid on mobile */}
            <div className="overflow-x-auto">
              <div className="min-w-[900px]">
                {" "}
                {/* Prevents column crushing */}
                <div className="bg-black text-white text-sm font-semibold">
                  <div className="grid grid-cols-5 gap-4 px-6 py-3">
                    <p>User Name</p>
                    <p>Phone</p>
                    <p>Status</p>
                    <p className="flex items-center gap-1">
                      Approved / Rejected
                      <span className="text-gray-300 text-xs">▼</span>
                    </p>
                    <p>Action</p>
                  </div>
                </div>
                {loading && (
                  <div className="flex items-center justify-center h-40">
                    <p className="text-gray-500 text-sm">Loading...</p>
                  </div>
                )}
                {events.map((c, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-5 gap-4 px-6 py-4 border-b hover:bg-gray-50 transition cursor-pointer items-center"
                    onClick={() => navigate(`/admin/event-request/${c._id}`)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={`https://ui-avatars.com/api/?name=${c.User?.userName}`}
                        className="w-10 h-10 rounded-full bg-gray-200 shrink-0"
                        alt="avatar"
                      />
                      <div className="truncate">
                        <p className="font-medium truncate">
                          {c.User?.userName}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {c.User?.userEmail}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center text-sm">
                      {c.User?.mobileNumber}
                    </div>

                    <div className="flex items-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          c.status === "Approved"
                            ? "bg-green-100 text-green-700"
                            : c.status === "Rejected"
                              ? "bg-red-100 text-red-600"
                              : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {c.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click navigation
                          handleApprove(c._id, c.User?.userName);
                        }}
                        className="bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg shadow hover:bg-green-700 transition text-xs sm:text-sm whitespace-nowrap"
                      >
                        Approve
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent row click navigation
                          handleReject(c._id, c.User?.userName);
                        }}
                        className="bg-red-600 text-white px-3 sm:px-4 py-2 rounded-lg shadow hover:bg-red-700 transition text-xs sm:text-sm whitespace-nowrap"
                      >
                        Reject
                      </button>
                    </div>

                    <div className="flex items-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/admin/event-request/${c._id}`);
                        }}
                        className="p-2 hover:bg-gray-200 rounded-full transition"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="gray"
                        >
                          <path
                            strokeWidth="2"
                            d="M1.5 12s4-7.5 10.5-7.5S22.5 12 22.5 12s-4 7.5-10.5 7.5S1.5 12 1.5 12z"
                          />
                          <circle cx="12" cy="12" r="3" strokeWidth="2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {events.length === 0 && !loading && (
              <p className="text-gray-500 text-center py-10">
                No pending campaigns.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
