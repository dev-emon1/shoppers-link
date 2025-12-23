// components/Pagination.jsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  perPage = 10,
  totalItems = 0,
  onPageChange,
  onPerPageChange,
}) => {
  const from = totalItems === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const to = totalItems === 0 ? 0 : Math.min(currentPage * perPage, totalItems);
  // console.log(totalItems);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 bg-gray-50 border-t">
      <div className="text-sm font-medium text-gray-600">
        {totalItems > 0 ? (
          <>
            Showing <span className="text-orange-600 font-bold">{from}</span> -{" "}
            <span className="text-orange-600 font-bold">{to}</span> of{" "}
            <span className="text-orange-600 font-bold">{totalItems}</span> products
          </>
        ) : (
          <span className="text-red-600">No products found</span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <select
          value={perPage}
          onChange={(e) => onPerPageChange?.(Number(e.target.value))}
          className="px-4 py-2 border rounded-md text-sm focus:ring-2 focus:ring-orange-500"
        >
          {[10, 20, 50, 100].map(n => <option key={n} value={n}>{n}</option>)}
        </select>

        <div className="flex items-center gap-3">
          <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}
            className="p-2 rounded hover:bg-orange-100 disabled:opacity-50">
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm font-semibold">
            Page <span className="text-orange-600">{currentPage}</span> of{" "}
            <span className="text-orange-600">{totalPages}</span>
          </span>
          <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}
            className="p-2 rounded hover:bg-orange-100 disabled:opacity-50">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;