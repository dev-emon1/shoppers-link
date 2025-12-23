// modules/user/components/dashboard/order/OrdersToolbar.jsx
"use client";
import React, { useState, useCallback } from "react";

export default function OrdersToolbar({ onSearch, onFilter, onRefresh }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");

  const handleSearch = useCallback(() => onSearch?.(q), [q, onSearch]);

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="flex items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search order id, product, sku..."
          className="px-3 py-2 border rounded-md w-72 text-sm"
        />
        <button
          onClick={handleSearch}
          className="px-3 py-2 bg-main text-white rounded-md text-sm"
        >
          Search
        </button>
        <button
          onClick={onRefresh}
          className="px-3 py-2 border rounded-md text-sm"
        >
          Refresh
        </button>
      </div>

      <div className="flex items-center gap-2">
        <select
          className="px-3 py-2 border rounded-md text-sm"
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            onFilter?.(e.target.value);
          }}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  );
}
