import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPendingCampaigns, updateCampaignStatus } from "../../store/campaignRequestSlice.js";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import AdminSidebar from "../../components/Admin/AdminSidebar.jsx";
import AdminNavbar from "../../components/Admin/AdminNavbar.jsx";

export default function CampaignRequestList() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);

  const { campaigns, loading } = useSelector((state) => state.campaignRequests);

  useEffect(() => {
    dispatch(fetchPendingCampaigns());
  }, [dispatch]);

  const handleStatus = (id, status) => {
    dispatch(updateCampaignStatus({ campaignId: id, status }));
  };

  const handleReject = (campaignId ,userName) => {
    Swal.fire({
      title: 'Reject Campaign',
      text: `Please provide a mandatory reason for rejecting ${userName} campaign:`,
      icon: 'warning',
      input: 'textarea', // Use a textarea input type
      inputLabel: 'Rejection Reason (Required)',
      inputPlaceholder: 'Enter reason here...',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Submit Rejection',
      
      // Ensure input is not empty before confirming
      inputValidator: (value) => {
        if (!value) {
          return 'You must enter a rejection reason!';
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const rejectionReason = result.value;
        
  
        dispatch(updateCampaignStatus({ 
          campaignId,
          status: 'Rejected',
          rejectionReason: rejectionReason,
        }))

        // Show rejection feedback
        Swal.fire(
          'Rejected!',
          'The campaign request has been rejected and the reason has been logged.',
          'error'
        );

        dispatch(fetchPendingCampaigns())
      }
    });
  };


  const handleApprove = (campaignId ,userName) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to approve the campaign from ${userName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Approve it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Dispatch the Redux action only if confirmed
        dispatch(updateCampaignStatus({ 
          campaignId,
          status: 'Approved' 
        }))
      
        Swal.fire(
          'Approved!',
          'The campaign request has been successfully approved and removed from the list.',
          'success'
        );
        dispatch(fetchPendingCampaigns())
      }
      }
    );
  };



  return (
     <div className="bg-gray-50 min-h-screen">
      {/* FIXED SIDEBAR */}
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* MAIN CONTENT WITH SHIFT */}
      <div
        className="transition-all duration-300"
        style={{
          marginLeft: collapsed ? 80 : 240, // Key fix!
          paddingTop: 72, // navbar height
        }}
      >
        <AdminNavbar collapsed={collapsed} />

        <div className="p-8 mt-1">
          <h1 className="text-3xl font-semibold mb-6">Campaign Request</h1>

          {loading && <p>Loading...</p>}

         <div className="bg-white shadow rounded-xl overflow-hidden">

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

  {campaigns.map((c, i) => (
    <div
      key={i}
      className="grid grid-cols-5 gap-4 px-6 py-4 border-b hover:bg-gray-50 transition cursor-pointer"
    >
      <div className="flex items-center gap-3">
        <img
          src={`https://ui-avatars.com/api/?name=${c.User?.userName}`}
          className="w-10 h-10 rounded-full bg-gray-200"
        />
        <div>
          <p className="font-medium">{c.User?.userName}</p>
          <p className="text-xs text-gray-500">{c.User?.userEmail}</p>
        </div>
      </div>

      <div className="flex items-center">{c.User?.mobileNumber}</div>

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




      <div className="flex items-center gap-3">
  <button
    onClick={()=>handleApprove(c._id,c.User?.userName)}
    className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition"
  >
    Approve
  </button>
  <button
  onClick={()=>handleReject(c._id,c.User?.userName)}
    className="bg-red-600 text-white px-4 py-2 rounded-lg shadow hover:bg-red-700 transition"
  >
    Reject
  </button>
</div>



{/* 
      <div className="flex items-center">
        <button
          onClick={() =>
            handleStatus(c._id, c.status === "Approved" ? "Rejected" : "Approved")
          }
          className={`flex items-center w-20 h-7 rounded-full transition ${
            c.status === "Approved" ? "bg-black justify-end" : "bg-gray-200"
          }`}
        >
          <span
            className={`${
              c.status === "Approved"
                ? "text-white text-[10px] mr-2"
                : "text-gray-600 text-[10px] ml-2"
            }`}
          >
            {c.status === "Approved" ? "Approved" : "Rejected"}
          </span>
          <div
            className={`w-6 h-6 bg-white rounded-full shadow ${
              c.status === "Approved" ? "mr-1" : "ml-1"
            }`}
          />
        </button>
      </div> */}




      <div className="flex items-center">
        <button
          onClick={() => navigate(`/admin/campaigns-request/${c._id}`)}
          className="p-2 hover:bg-gray-200 rounded-full"
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

  {campaigns.length === 0 && !loading && (
    <p className="text-gray-500 text-center py-10">No pending campaigns.</p>
  )}
</div>


        </div>

      </div>
    </div>
  );
}
