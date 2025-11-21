import React from "react";
import Navbar from "../User/Navbar"; 
export default function ErrorFallback() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Content */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          500 Error
        </h1>

        <p className="text-gray-600 max-w-md mb-6">
          Something went wrong on this page.  
          Don't worry — you can return to the home page.
        </p>

        <button
        onClick={()=> window.location.href="/"}
          className="px-6 py-3 bg-black text-white rounded-lg shadow hover:bg-gray-800 transition"
        >
          Back to Home Page
        </button>
      </div>
    </div>
  );
}
