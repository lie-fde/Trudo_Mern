import React from "react";
import { ChevronRight, ChevronLeft , Download , ChevronDown , Search} from "lucide-react";
import { useState } from "react";

export const DataTable = ({ item }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-4 px-6 text-xs font-bold text-green-600 uppercase tracking-wide">
                Campaign ID
              </th>
              <th className="py-4 px-6 text-xs font-bold text-green-600 uppercase tracking-wide">
                Campaign Name
              </th>
              <th className="py-4 px-6 text-xs font-bold text-green-600 uppercase tracking-wide">
                User Email
              </th>
              <th className="py-4 px-6 text-xs font-bold text-green-600 uppercase tracking-wide">
                User Name
              </th>
              <th className="py-4 px-6 text-xs font-bold text-green-600 uppercase tracking-wide text-center">
                Date
              </th>
              <th className="py-4 px-6 text-xs font-bold text-green-600 uppercase tracking-wide text-right">
                Amount
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {item.map((row, idx) => (
              <tr key={idx} className="hover:bg-gray-50/80 transition-colors group">
                
                {/* Campaign ID */}
                <td className="py-4 px-6 text-sm font-bold text-gray-700">
                  #{String(row.campaignId).slice(-4)}
                </td>

                {/* Campaign Name */}
                <td className="py-4 px-6 text-sm font-medium text-gray-600">
                  {row.campaignName}
                </td>

                {/* Email */}
                <td className="py-4 px-6 text-sm text-gray-500 group-hover:text-gray-700">
                  {row.userEmail}
                </td>

                {/* Username */}
                <td className="py-4 px-6 text-sm font-bold text-gray-600">
                  {row.userName}
                </td>

                {/* Date */}
                <td className="py-4 px-6 text-sm font-bold text-gray-700 text-center">
                  {new Date(row.date).toLocaleDateString()}
                </td>

                {/* Amount */}
                <td className="py-4 px-6 text-sm font-bold text-gray-800 text-right">
                  ₹{row.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};


export const StatsCardReport = ({ title, value, icon: Icon, color, bg }) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5 transition-transform hover:-translate-y-1 duration-200">
    <div
      className={`w-14 h-14 rounded-full ${bg} flex items-center justify-center shrink-0`}
    >
      <Icon size={28} className={color} strokeWidth={1.5} />
    </div>
    <div>
      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">
        {title}
      </p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);






export const FilterDropdown = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-48 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 shadow-sm hover:border-gray-300 focus:outline-none"
      >
        <span>Search campaign</span>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-10 overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
               <input 
                type="text" 
                placeholder="Find an campaign" 
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 rounded-md border-none focus:ring-0 text-gray-600 placeholder-gray-400"
              />
              <Search size={12} className="absolute left-2.5 top-2 text-gray-400" />
            </div>
           
          </div>
          <div className="p-1">
            <div className="flex items-center justify-between px-3 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium cursor-pointer">
              <span>cancer</span>
              <span className="text-purple-600">✓</span>
            </div>
            <div className="px-3 py-2 text-gray-600 text-sm hover:bg-gray-50 rounded-lg cursor-pointer">
              Kidney
            </div>
          </div>
        </div>
      )}
    </div>
  );
};