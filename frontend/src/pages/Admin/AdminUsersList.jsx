import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/Admin/AdminSidebar.jsx";
import AdminNavbar from "../../components/Admin/AdminNavbar.jsx";
import { Search, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import { blockUser, fetchUsersList, unblockUser ,deleteUser} from "../../services/adminService.js";

export default function UsersList() {
  const [collapsed, setCollapsed] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7; 

  const navigate = useNavigate();

  // Handle screen resize for sidebar logic
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetchUsersList()
        setUsers(res.data.users);
      } catch (err) {
        console.log("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    u.userName.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };


const handleBlockUser = (id, isBlocked) => {
  Swal.fire({
    title: isBlocked ? "Unblock this user?" : "Block this user?",
    text: isBlocked 
      ? "This user will regain access to their account." 
      : "The user will not be able to access their account.",
    icon: isBlocked ? "info" : "warning",
    showCancelButton: true,
    confirmButtonColor: isBlocked ? "#16a34a" : "#f59e0b",
    cancelButtonColor: "#3085d6",
    confirmButtonText: isBlocked ? "Yes, unblock user" : "Yes, block user",
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {

        if (!isBlocked) {
          await blockUser(id)
        } else {
          await unblockUser(id)
        }

        Swal.fire({
          title: isBlocked ? "Unblocked!" : "Blocked!",
          text: isBlocked 
            ? "User has been unblocked successfully."
            : "User has been blocked successfully.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });

        setUsers((prev) =>
          prev.map((user) =>
            user._id === id ? { ...user, isBlocked: !isBlocked } : user
          )
        );

      } catch (err) {
        Swal.fire("Error", "Failed to update user status", "error");
      }
    }
  });
};


  const handleDeleteUser = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This user will be permanently removed!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete user",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteUser(id);

                setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== id)
        );

          Swal.fire({
            title: "Deleted!",
            text: "User has been removed.",
            icon: "success",
          });

        } catch (err) {
          Swal.fire("Error", "Failed to delete user", "error");
        }
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
          marginLeft: isMobile ? 0 : (collapsed ? 80 : 240),
          paddingTop: 72, // navbar height
        }}
      >
        <AdminNavbar collapsed={collapsed} setCollapsed={setCollapsed}/>

        <div className="p-4 sm:p-8 mt-1">
          <h1 className="text-xl sm:text-2xl font-semibold mb-1">Users List</h1>
          <p className="text-xs sm:text-sm text-gray-500 mb-6">Dashboard / Users</p>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="relative w-full sm:w-72">
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search user..."
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-1 focus:ring-green-600 outline-none"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1); 
                }}
              />
            </div>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Added overflow-x-auto to handle large tables on mobile */}
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead className="bg-gray-100 text-gray-600 text-sm">
                  <tr>
                    <th className="p-4">User Name</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Donations Made</th>
                    <th className="p-4">Total Donated</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Block / Unblock</th>
                    <th className="p-4">Delete</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  {currentUsers.map((user, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={`https://ui-avatars.com/api/?name=${user.userName}&background=random`}
                          className="w-8 h-8 rounded-full shrink-0"
                          alt="avatar"
                        />
                        <div className="min-w-0">
                          <p className="font-medium truncate">{user.userName}</p>
                          <p className="text-xs text-gray-500 truncate">{user.userEmail}</p>
                        </div>
                      </td>

                      <td className="p-4 text-sm whitespace-nowrap">{user.mobileNumber}</td>
                      <td className="p-4 text-sm">{user.totalDonations || 0}</td>
                      <td className="p-4 text-sm font-semibold text-gray-700">₹ {user.totalAmountDonated || 0}</td>

                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${
                            user.isBlocked
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {user.isBlocked ? "Blocked" : "Active"}
                        </span>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleBlockUser(user._id, user.isBlocked)}
                          className={`w-24 py-1.5 rounded-md text-xs font-bold transition-all ${
                            user.isBlocked
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-orange-500 hover:bg-orange-600 text-white"
                          }`}
                        >
                          {user.isBlocked ? "UNBLOCK" : "BLOCK"}
                        </button>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={()=>handleDeleteUser(user._id)}
                          className="px-4 py-1.5 rounded-md text-xs font-bold bg-red-600 hover:bg-red-700 text-white transition-all"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination - Responsive wrap */}
          <div className="flex flex-wrap justify-center items-center mt-6 gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded text-sm hover:bg-gray-100 disabled:opacity-50"
            >
              Prev
            </button>

            <div className="flex gap-1 overflow-x-auto py-1">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i + 1)}
                  className={`px-3 py-1 border rounded text-sm transition-colors ${
                    currentPage === i + 1 ? "bg-green-600 text-white" : "hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded text-sm hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}