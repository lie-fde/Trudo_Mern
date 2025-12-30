 import React from "react";
 import { useState } from "react";
 import { TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
 
 export const DonationBarChart = ({ data }) => {
  const [activeTab, setActiveTab] = useState('monthly');
  const maxAmount = Math.max(...data.map(d => d.amount));
  const chartHeight = 240;

  const navigate = useNavigate()

  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header with Tab Switching */}
      <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold">Revenue Breakdown</h2>
          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase rounded tracking-wider">Annual View</span>
        </div>
    
      </div>

      <div className="p-6">
        <div className="relative h-[300px] w-full flex items-end justify-between px-2 pt-10">
          {/* Y-Axis Guideline Helpers */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[10px] text-gray-400 font-medium pb-8 pl-1">
            {[100, 75, 50, 25, 0].map(percent => (
              <div key={percent} className="flex items-center gap-3 w-full">
                <span className="w-8">{(maxAmount * percent / 100).toLocaleString()}</span>
                <div className="flex-1 border-t border-gray-100 border-dashed"></div>
              </div>
            ))}
          </div>

          {/* Visualization Bars */}
          <div className="flex-1 flex items-end justify-between h-full z-10 pl-10 pr-4 pb-8">
            {data.map((item) => {
              const height = (item.amount / maxAmount) * chartHeight;
              return (
                <div key={item.month} className="group relative flex flex-col items-center flex-1">
                  {/* Custom Tooltip */}
                  <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-all duration-200 z-20 pointer-events-none scale-90 group-hover:scale-100">
                    <div className="bg-gray-900 text-white text-xs py-2 px-3 rounded-lg shadow-xl whitespace-nowrap">
                      <p className="font-bold mb-1">{item.month} 2025</p>
                      <div className="flex justify-between gap-4">
                        <span>Amount:</span>
                        <span className="text-indigo-300">₹{item.amount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span>Donors:</span>
                        <span className="text-indigo-300">{item.count}</span>
                      </div>
                    </div>
                    <div className="w-2 h-2 bg-gray-900 rotate-45 mx-auto -mt-1"></div>
                  </div>

                  {/* The Bar */}
                  <div 
                    style={{ height: `${height}px` }}
                    className="w-4 sm:w-8 lg:w-12 rounded-t-md bg-gradient-to-t from-indigo-600 to-indigo-400 group-hover:from-indigo-500 group-hover:to-indigo-300 transition-all duration-300 relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  
                  {/* Label */}
                  <span className="absolute top-full mt-3 text-xs font-medium text-gray-400 group-hover:text-indigo-600 transition-colors">
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
        <p>Data automatically updated as of 12:00 PM today.</p>
        <button className="text-indigo-600 font-semibold hover:underline flex items-center gap-1"
        onClick={()=> navigate("/admin/event-report")}>
          View Full Report <TrendingUp size={12} />
        </button>
      </div>
    </section>
  );
};