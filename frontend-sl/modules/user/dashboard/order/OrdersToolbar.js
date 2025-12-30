"use client";
import React, { useState, useCallback } from "react";

/**
 * OrdersToolbar
 *
 * Responsibilities:
 * - Collect user input (search, status, sort)
 * - Emit events upward
 *
 * Does NOT:
 * - Fetch data
 * - Know about redux / api
 */
export default function OrdersToolbar({
  onSearch,
  onFilter,
  onSort,
  onRefresh,
  initialQuery = "",
  initialStatus = "",
  initialSort = "latest",
}) {
  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState(initialStatus);
  const [sort, setSort] = useState(initialSort);

  const handleSearch = useCallback(() => {
    onSearch?.(query.trim());
  }, [query, onSearch]);

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatus(value);
    onFilter?.(value);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSort(value);
    onSort?.(value);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      {/* LEFT : Search & Refresh */}
      <div className="flex items-center gap-2">
        <input
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            onSearch?.(value);
          }}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Search order id, product, sku..."
          className="px-3 py-2 border rounded-md w-72 text-sm"
        />

        <button
          onClick={handleSearch}
          className="px-3 py-2 bg-main text-white rounded-md text-sm hidden md:block"
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

      {/* RIGHT : Filter & Sort */}
      <div className="flex items-center gap-2">
        {/* STATUS FILTER */}
        <select
          className="px-3 py-2 border rounded-md text-sm"
          value={status}
          onChange={handleStatusChange}
        >
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>

        {/* SORT (frontend now, backend later) */}
        <select
          className="px-3 py-2 border rounded-md text-sm"
          value={sort}
          onChange={handleSortChange}
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="price_high">Price: High → Low</option>
          <option value="price_low">Price: Low → High</option>
        </select>
      </div>
    </div>
  );
}
