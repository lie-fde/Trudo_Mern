import React from "react";
import { useNavigate } from "react-router-dom";


const CTABanner = () =>{
    const navigate = useNavigate()

    return(
         <>

           <div className="my-12 py-10 px-8 bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-3xl shadow-sm flex flex-col md:flex-row justify-between items-center text-center md:text-left">
          <div>
            <p className="text-xl font-bold text-gray-800 mb-2">
              Facing an emergency?
            </p>
            <p className="text-gray-500">
              We connect you with trusted foundations to help you raise funds
              quickly.
            </p>
          </div>
          <button className="mt-6 md:mt-0 px-8 py-3 bg-orange-600 text-white font-medium rounded-full hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all transform hover:-translate-y-0.5"
          onClick={()=>navigate('/create-campaign')}>
            Raise a Campaign
          </button>
        </div>
        
        </>
    )
}

export default CTABanner