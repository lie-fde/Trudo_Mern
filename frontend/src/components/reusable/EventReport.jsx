import React from "react";

export const DataTableEvent = ({ item, loading }) => {
  return (
    <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto w-full">
        {/* Added min-width to ensure data doesn't collapse on mobile */}
        <table className="w-full text-left border-collapse min-w-[1000px]">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="py-4 px-6 text-xs font-bold text-green-600 uppercase tracking-wide">
                Event Name
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
              <th className="py-4 px-6 text-xs font-bold text-green-600 uppercase tracking-wide text-center">
                Tickets Purchased
              </th>
              <th className="py-4 px-6 text-xs font-bold text-green-600 uppercase tracking-wide text-center">
                Ticket Status
              </th>
              <th className="py-4 px-6 text-xs font-bold text-green-600 uppercase tracking-wide text-right">
                Amount
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-10 text-center text-gray-400">Loading events...</td>
              </tr>
            ) : item.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-10 text-center text-gray-400">No events found.</td>
              </tr>
            ) : (
              item.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="py-4 px-6 text-sm font-medium text-gray-600">
                    {row.eventName}
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500 group-hover:text-gray-700">
                    {row.userEmail}
                  </td>
                  <td className="py-4 px-6 text-sm font-bold text-gray-600">
                    {row.userName}
                  </td>
                  <td className="py-4 px-6 text-sm font-bold text-gray-700 text-center">
                    {row.date ? new Date(row.date).toLocaleDateString() : "N/A"}
                  </td>
                  <td className="py-4 px-6 text-sm font-bold text-gray-800 text-center">
                    {row.numberOfTickets}
                  </td>
                  <td className="py-4 px-6 text-sm text-center">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                      row.ticketStatus === 'Confirmed' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {row.ticketStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm font-bold text-gray-800 text-right">
                    ₹{row.amount}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};