import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/Admin/AdminSidebar.jsx";
import AdminNavbar from "../../components/Admin/AdminNavbar.jsx";
import {Mail,Smartphone,MapPin,User,Globe,CalendarDays,IndianRupee,} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { blockUser, deleteUser, getUserDetails, unblockUser } from "../../services/adminService.js";

const MySwal = withReactContent(Swal)

export default function UserDetails() {
  const [collapsed, setCollapsed] = useState(false);
  const [tab, setTab] = useState("donations"); 
  const [isBlocked, setIsBlocked] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [user , setUser] = useState({})
  
   const {id} = useParams()
   const navigate = useNavigate()

   useEffect(()=>{
    
    if(!id) {
         setError("Invalid user ID");
         navigate('/admin/users')
         return
    }
    else{
        fetchUserdetails()
    }

   },[id])

   const fetchUserdetails = async () =>{
     try {
        const res = await getUserDetails(id)
        setUser(res.data.user)
        setIsBlocked(res.data.user.isBlocked);
     } 
    catch (err) {
        setError("Failed to load user details");
     }
     finally {
      setLoading(false);
    }
   }

    if (loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;


  const donations = [
    {
      id: "#302012",
      campaign: "Kidney Plantation",
      total: "₹40.00",
      status: "Failed",
      date: "12 Dec 2023",
    },
    {
      id: "#302011",
      campaign: "Cancer",
      total: "₹400.00",
      status: "Processing",
      date: "1 Dec 2023",
    },
    {
      id: "#302006",
      campaign: "Surgery",
      total: "₹50.00",
      status: "Success",
      date: "10 Nov 2023",
    },
  ];

  const events = [
    {
      id: "#302012",
      eventName: "Fitness Class",
      total: "₹40.00",
      status: "Failed",
      date: "12 Dec 2023",
    },
    {
      id: "#302011",
      eventName: "Fitness Class",
      total: "₹400.00",
      status: "Processing",
      date: "1 Dec 2023",
    },
    {
      id: "#302006",
      eventName: "Fitness Class",
      total: "₹50.00",
      status: "Success",
      date: "10 Nov 2023",
    },
  ];

  const statusColor = {
    Failed: "bg-red-100 text-red-600",
    Processing: "bg-yellow-100 text-yellow-600",
    Success: "bg-green-100 text-green-600",
  };

 const handleDeleteUser = () => {
  MySwal.fire({
    title: "Are you sure?",
    text: "This user will be permanently removed!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete user"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
       
         await deleteUser(id)
   

        Swal.fire({
          title: "Deleted!",
          text: "User has been removed.",
          icon: "success"
        });

        navigate('/admin/users')
      } catch (err) {
        Swal.fire("Error", "Failed to delete user", "error");
      }
    }
  });
};


  const handleBlockUser = () => {
  Swal.fire({
    title: "Block this user?",
    text: "The user will not be able to access their account.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#f59e0b",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, block user"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        
        await blockUser(id)

        Swal.fire({
          title: "Blocked",
          text: "User has been blocked successfully.",
          icon: "success"
        });
        fetchUserdetails()

      } catch (err) {
        Swal.fire("Error", "Failed to block user", "error");
      }
    }
  });
};


const handleunblockUser = () => {
  Swal.fire({
    title: "Unblock this user?",
    text: "The user will regain full access!",
    icon: "info",
    showCancelButton: true,
    confirmButtonColor: "#16a34a",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, unblock user"
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await unblockUser(id)

        Swal.fire({
          title: "Unblocked!",
          text: "User is now active.",
          icon: "success"
        });

         fetchUserdetails()

      } catch (err) {
        Swal.fire("Error", "Failed to unblock user", "error");
      }
    }
  });
};


  return (
    <div className="flex bg-gray-50 min-h-screen">
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="flex-1 flex flex-col">
        <AdminNavbar collapsed={collapsed} />
        <div className="p-8 mt-16">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h1 className="text-2xl font-semibold">User Details</h1>
              <p className="text-sm text-gray-500">Dashboard / User List / User Details</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600"
              >
                Delete User
              </button>

              <button
                onClick={isBlocked? handleunblockUser:handleBlockUser}
                className="px-4 py-2 bg-red-600 text-white rounded-md text-sm hover:bg-red-700"
              >
                {isBlocked ? "Unblock User" : "Block User"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-6 mt-6">
  
            <div className="col-span-4 bg-white shadow rounded-lg p-6">

              <div className="flex flex-col items-center pb-6 border-b">
                <div className="w-full h-28 bg-gray-200 rounded-lg"></div>
                <div className="-mt-12 w-24 h-24 bg-gray-400 rounded-full"></div>
                <h2 className="mt-3 font-semibold text-gray-800">{user.userName}</h2>
              </div>

              <div className="mt-6 space-y-4 text-sm text-gray-700">
                <DetailItem icon={<User size={16} />} label="Full Name" value={user.userName} />
                <DetailItem icon={<Mail size={16} />} label="Email" value={user.userEmail} />
                <DetailItem icon={<Smartphone size={16} />} label="Phone Number" value={user.mobileNumber} />
                <DetailItem
                  icon={<MapPin size={16} />}
                  label="Address"
                  value={`${user.address.street}, ${user.address.city}, ${user.address.state}`}
                />
                <DetailItem icon={<User size={16} />} label="Gender" value={user.gender} />
                <DetailItem icon={<Globe size={16} />} label="Country" value={user.address.country} />
              </div>
            </div>

            <div className="col-span-8 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <SummaryCard
                  icon={<IndianRupee />}
                  label="Total Donated"
                  value="₹ 7200"
                />
                <SummaryCard
                  icon={<CalendarDays />}
                  label="Total Events Participated"
                  value="35"
                />
              </div>

              <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
                <div className="flex gap-4">
                  <TabButton
                    active={tab === "donations"}
                    onClick={() => setTab("donations")}
                  >
                    Donations
                  </TabButton>

                  <TabButton
                    active={tab === "events"}
                    onClick={() => setTab("events")}
                  >
                    Events
                  </TabButton>
                </div>

                <div className="flex gap-3">
                  <button className="px-3 py-1 border rounded text-gray-600 text-sm">
                    Select Date
                  </button>
                  <button className="px-3 py-1 border rounded text-gray-600 text-sm">
                    Filters
                  </button>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-black text-white">
                    <tr>
                      {tab === "donations" ? (
                        <>
                          <th className="p-3">Donation ID</th>
                          <th className="p-3">Campaign</th>
                          <th className="p-3">Total</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Date</th>
                        </>
                      ) : (
                        <>
                          <th className="p-3">Event ID</th>
                          <th className="p-3">Event Name</th>
                          <th className="p-3">Total</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Date</th>
                        </>
                      )}
                    </tr>
                  </thead>

                  <tbody>
                    {(tab === "donations" ? donations : events).map((item, i) => (
                      <tr key={i} className="border-b hover:bg-gray-50">
                        <td className="p-3 text-blue-600 underline">{item.id}</td>
                        <td className="p-3">{item.campaign || item.eventName}</td>
                        <td className="p-3">{item.total}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${statusColor[item.status]}`}>
                            {item.status}
                          </span>
                        </td>
                        <td className="p-3">{item.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


const DetailItem = ({ icon, label, value }) => (
  <div className="flex items-start gap-3">
    <span className="text-gray-500">{icon}</span>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

const SummaryCard = ({ icon, label, value }) => (
  <div className="bg-white p-5 rounded-lg shadow border">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-green-100 text-green-600 rounded-lg">{icon}</div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <h2 className="font-bold text-xl">{value}</h2>
      </div>
    </div>
  </div>
);

const TabButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-1 rounded text-sm font-medium ${
      active ? "text-black border-b-2 border-black" : "text-gray-500"
    }`}
  >
    {children}
  </button>
);

const Pagination = () => (
  <div className="flex justify-center gap-2 mt-4">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        className={`px-3 py-1 border rounded ${
          n === 1 ? "bg-black text-white" : "hover:bg-gray-100"
        }`}
      >
        {n}
      </button>
    ))}
    <span className="px-3 py-1">…</span>
  </div>
);
