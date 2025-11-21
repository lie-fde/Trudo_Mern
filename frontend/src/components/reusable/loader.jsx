import React from "react";

 const Loader = () =>{
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 to-yellow-100">

      <div className="backdrop-blur-xl bg-white/40 p-8 rounded-3xl shadow-2xl flex flex-col items-center">
        
        <div className="w-14 h-14 border-4 border-white border-t-pink-500 rounded-full animate-spin"></div>

        <h2 className="mt-6 text-xl font-semibold text-gray-800 tracking-wide">
          Restoring your session...
        </h2>

        <p className="text-sm text-gray-600 mt-2 animate-pulse">
          Please wait a moment ✨
        </p>
      </div>

    </div>
    )
   
}

export default Loader