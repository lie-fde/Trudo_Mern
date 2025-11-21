import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/User/Navbar"; 

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          404 Not Found
        </h1>

        <p className="text-gray-600 max-w-md mb-6">
          Your visited page was not found. You may go back home.
        </p>

        <Link
          to="/"
          className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
        >
          Back to Home Page
        </Link>
      </div>
    </div>
  );
}
