import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { setCredentials } from "../../store/authSlice";
import api from "../../api/api";

export default function Navbar() {
  const navigate = useNavigate();
  const userName = useSelector((state)=>state.auth.userName)
  const dispatch = useDispatch()

const handleLogout =  () => {
  Swal.fire({
    title: "Are you sure?",
    text: "You will be logged out from your account.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Logout",
  }).then(async(result) => {
    if (result.isConfirmed) {
      await api.post('auth/users/logout') 

      dispatch(setCredentials({
      accessToken: null,
      userName: null
     }))
     
      Swal.fire({
       icon: "success",
       title: "Logged out!",
       text: "You have been logged out successfully.",
       timer: 1500,
       showConfirmButton: false
});
      navigate("/home", { replace: true });
    }
  });
};

  return (
    <nav className="w-full bg-black text-white py-4 px-6 flex items-center justify-between shadow-md">
    
      <h1 className="text-xl font-semibold tracking-wide cursor-pointer" onClick={() => navigate("/")}>
        Trudo
      </h1>

 
      <div className="hidden md:flex gap-6 text-sm items-center">
        <button className="hover:text-gray-300 transition">Home</button>
        <button className="hover:text-gray-300 transition">Donate</button>
        <button className="hover:text-gray-300 transition">Events</button>
        <button className="hover:text-gray-300 transition">My Ticket</button>
        <button className="hover:text-gray-300 transition">My Donation</button>
        <button className="hover:text-gray-300 transition">Contact us</button>
      </div>


      <div className="flex items-center gap-3">
        {userName ? (
          <>
            <span className="text-gray-300 text-sm">Hi, {userName}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-1 rounded-md border border-white hover:bg-white hover:text-black transition text-sm"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-1 rounded-md border border-white hover:bg-white hover:text-black transition text-sm"
          >
            Log in
          </button>
        )}
      </div>
    </nav>
  );
}
