import React from "react";

export default function Pagination({ page, pages, setPage }) {
  if (pages <= 1) return null;

  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center items-center gap-4 py-8">

      {/* Previous */}
      <button
        onClick={() => page > 1 && setPage(page - 1)}
        className={`text-xl ${page === 1 ? "text-gray-400" : "text-gray-700"}`}
      >
        {"<"}
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-3">
        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => setPage(num)}
            className={`w-10 h-10 flex items-center justify-center rounded-full text-sm font-semibold 
              ${
                num === page
                  ? "bg-orange-500 text-white"
                  : "bg-transparent text-gray-700"
              }`}
          >
            {num}
          </button>
        ))}
      </div>

      {/* Next */}
      <button
        onClick={() => page < pages && setPage(page + 1)}
        className={`text-xl ${
          page === pages ? "text-gray-400" : "text-gray-700"
        }`}
      >
        {">"}
      </button>

    </div>
  );
}
