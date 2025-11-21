import React from "react";
import Navbar from "../../components/User/Navbar.jsx"
import frontImage from '../../assets/Front image .png'
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Home() {


  const userName = useSelector((state)=> state.auth.userName)

  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#f8f9fb] flex flex-col">
      <Navbar />
      <div className="flex flex-col lg:flex-row items-center justify-between px-10 lg:px-20 py-16 gap-10">
        <div className="lg:w-1/2">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
            Transparent Giving <br />
            for a Better <br />
            Tomorrow | <span className="text-pink-600">Trudo</span>
          </h1>

          <p className="text-gray-600 mt-5 text-lg">
            Welcome back, <span className="font-semibold text-gray-800">{userName}</span> 👋  
            Empower change with trust & security.
          </p>

          <button
            // onClick={() => alert("Feature coming soon")}
            onClick={()=> navigate('/me')}
            className="bg-black text-white px-6 py-3 rounded-md mt-6 hover:bg-gray-800 transition"
          >
            Create a Campaign
          </button>
        </div>

        <div className="lg:w-1/2 flex justify-center">
          <img
            src={frontImage}
            alt="Donation Illustration"
            className="w-full max-w-lg drop-shadow-lg rounded-xl"
          />
        </div>

      </div>

    </div>
  );
}
