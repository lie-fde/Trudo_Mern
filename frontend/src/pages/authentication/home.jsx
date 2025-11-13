import React from "react";
import {useNavigate} from 'react-router-dom'

function Home () {

    const navigate = useNavigate()

    const userName = localStorage.getItem("userName") || "Guest"

    const handleLogout = ()=>{
        localStorage.removeItem("token"),
        localStorage.removeItem("userName")
        navigate('/login')
    }

    return (

         <div className="h-screen w-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-400">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-[90%] max-w-sm text-center transform transition hover:scale-105">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Welcome, <span className="text-blue-600">{userName}</span> 👋
        </h1>
        <p className="text-gray-500 mb-6">
          Glad to see you back! Explore your dashboard and continue where you left off.
        </p>

        <button
          onClick={handleLogout}
          className="px-6 py-2 w-full rounded-md bg-gradient-to-r from-red-500 to-pink-500 text-white font-medium shadow-md hover:opacity-90 transition"
        >
          Logout
        </button>
      </div>
    </div>
    )
}

export default Home