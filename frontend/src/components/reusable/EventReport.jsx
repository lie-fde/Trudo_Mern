import React from "react";

export const DataTableEvent = ({ item }) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              {/* <th className="py-4 px-6 text-xs font-bold text-green-600 uppercase tracking-wide">
                Campaign ID
              </th> */}
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
            {item.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-50/80 transition-colors group"
              >
                {/* Campaign ID */}
                {/* <td className="py-4 px-6 text-sm font-bold text-gray-700">
                  #{String(row.campaignId).slice(-4)}
                </td> */}

                {/* Campaign Name */}
                <td className="py-4 px-6 text-sm font-medium text-gray-600">
                  {row.eventName}
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
                <td className="py-4 px-20 text-sm font-bold text-gray-800 text-right">
                  {row.numberOfTickets}
                </td>

                <td className="py-4 px-10 text-sm font-bold text-gray-600">
                  {row.ticketStatus}
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
