import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/Admin/AdminSidebar.jsx";
import AdminNavbar from "../../components/Admin/AdminNavbar.jsx";
import { Search, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import { blockUser, fetchUsersList, unblockUser } from "../../services/adminService.js";

export default function UsersList() {
  const [collapsed, setCollapsed] = useState(false);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 7; 

  const navigate = useNavigate();

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
          <h1 className="text-2xl font-semibold mb-1">Users List</h1>
          <p className="text-sm text-gray-500 mb-6">Dashboard / Users</p>

          <div className="flex justify-between items-center mb-6">
            <div className="relative w-72">
              <Search size={18} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                placeholder="Search user..."
                className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-1 focus:ring-green-600"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1); 
                }}
              />
            </div>

            <button className="px-4 py-2 border text-gray-600 rounded-md hover:bg-gray-100">
              Filters
            </button>
          </div>

          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-gray-600 text-sm">
                <tr>
                  <th className="p-4">User Name</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Donations Made</th>
                  <th className="p-4">Total Donated</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Block / Unblock</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {currentUsers.map((user, i) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-4 flex items-center gap-2">
                      <img
                        src={`https://ui-avatars.com/api/?name=${user.userName}`}
                        className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <p className="font-medium">{user.userName}</p>
                        <p className="text-xs text-gray-500">{user.userEmail}</p>
                      </div>
                    </td>

                    <td className="p-4">{user.mobileNumber}</td>
                    <td className="p-4">{user.donationsCount || 0}</td>
                    <td className="p-4">₹ {user.totalDonated || 0}</td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
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
                        className={`px-4 py-1 rounded-full text-sm font-medium ${
                          user.isBlocked
                            ? "bg-green-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {user.isBlocked ? "UNBLOCK" : "BLOCK"}
                      </button>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => navigate(`/admin/users/${user._id}`, {
      state: { userId: user._id }
    })}
                        className="p-2 rounded-full hover:bg-gray-200"
                      >
                        <Eye size={20} className="text-gray-600" />
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-center mt-4 gap-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => goToPage(i + 1)}
                className={`px-3 py-1 border rounded ${
                  currentPage === i + 1 ? "bg-green-600 text-white" : "hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              className="px-3 py-1 border rounded hover:bg-gray-100"
            >
              Next
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

