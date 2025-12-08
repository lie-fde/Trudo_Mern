import React from "react";
import { Download } from "lucide-react";

export const DonationRow = ({ item }) => {
  return (
    <>
      <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 transition hover:shadow-md mb-4">
        <div className="grid grid-cols-2 md:grid-cols-7 gap-4 w-full items-center text-sm">

          <div className="col-span-1">
            <span className="md:hidden text-xs text-gray-400 block mb-1">
              Event
            </span>
            <span className="font-medium text-gray-700">{item.event}</span>
          </div>

          <div className="col-span-1">
            <span className="md:hidden text-xs text-gray-400 block mb-1">
              Created By
            </span>
            <span className="text-gray-600">{item.createdBy}</span>
          </div>

          <div className="col-span-1">
            <span className="md:hidden text-xs text-gray-400 block mb-1">
              Date
            </span>
            <span className="text-gray-500">
              {item.date
                ? new Date(item.date).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "No Donations Yet"}
            </span>
          </div>

          <div className="col-span-1">
            <span className="md:hidden text-xs text-gray-400 block mb-1">
              Amount
            </span>
            <span className="font-semibold text-gray-900">{item.amount}</span>
          </div>

          <div className="col-span-1 hidden md:block">
            <span className="text-gray-600">{item.method}</span>
          </div>

          <div className="col-span-1 hidden md:block">
            <span className="text-gray-500 text-xs font-mono">
              {item.transactionId}
            </span>
          </div>

          <div className="col-span-1 flex items-center gap-1 text-green-600 font-medium">
            <span className="md:hidden text-xs text-gray-400 block mr-2">
              Status:
            </span>
            {item.status}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end md:justify-center w-full md:w-auto shrink-0 border-t md:border-0 pt-3 md:pt-0 mt-2 md:mt-0">
          <button
            className="flex items-center gap-1 text-xs font-semibold text-gray-700 hover:text-black transition border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50"
            onClick={() => window.open(item.receiptUrl, "_blank")}
          >
            <Download size={14} /> View Receipt
          </button>
        </div>
      </div>
    </>
  );
};

export const StatCard = ({ icon: Icon, title, value, colorClass }) => {
  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center gap-3 min-h-[160px] hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 text-gray-500 font-medium text-sm">
          <Icon size={18} className={colorClass} />
          <span>{title}</span>
        </div>
        <div className="text-3xl font-bold text-gray-900 mt-1">{value}</div>
      </div>
    </>
  );
};
