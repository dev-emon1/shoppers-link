"use client";

import React, { useEffect, useMemo, useState } from "react";
import useOrders from "@/modules/user/hooks/useOrders";
import OrdersToolbar from "./OrdersToolbar";
import OrderCard from "./OrderCard";
import useDebounce from "@/lib/hooks/useDebounce";

export default function OrdersPageComponent() {
  const { list, loading, fetchOrders, meta } = useOrders();

  /* ----------------------------------
     LOCAL UI STATE (FRONTEND ONLY)
  ---------------------------------- */
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("latest");

  const debouncedQuery = useDebounce(query, 300);

  /* ----------------------------------
     INITIAL LOAD (API HIT ONCE)
  ---------------------------------- */
  useEffect(() => {
    fetchOrders({ page: 1, per_page: 10 }).catch(() => {});
  }, [fetchOrders]);

  /* ----------------------------------
     FRONTEND SEARCH + FILTER + SORT
     TODO (FUTURE):
     - Move search/status/sort to backend
  ---------------------------------- */
  const filteredAndSortedList = useMemo(() => {
    if (!Array.isArray(list)) return [];

    let arr = [...list];

    /* 🔍 MODERN FRONTEND SEARCH (DEBOUNCED) */
    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();

      arr = arr.filter((order) => {
        // Order ID
        if (order.unid?.toLowerCase().includes(q)) return true;

        // Any product name
        return order.vendor_orders?.some((vo) =>
          vo.items?.some((item) =>
            item.product?.name?.toLowerCase().includes(q)
          )
        );
      });
    }

    /* 🎯 STATUS FILTER */
    if (status) {
      arr = arr.filter((o) => (o.status ?? "").toLowerCase() === status);
    }

    /* 🔀 SORTING */
    switch (sort) {
      case "oldest":
        arr.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;
      case "price_high":
        arr.sort((a, b) => Number(b.total_amount) - Number(a.total_amount));
        break;
      case "price_low":
        arr.sort((a, b) => Number(a.total_amount) - Number(b.total_amount));
        break;
      default:
        arr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    return arr;
  }, [list, debouncedQuery, status, sort]);

  /* ----------------------------------
     RENDER
  ---------------------------------- */
  return (
    <div>
      <div className="mb-4">
        <OrdersToolbar
          onSearch={(q) => {
            setQuery(q);
          }}
          onFilter={(s) => {
            setStatus(s);
          }}
          onSort={(s) => {
            setSort(s);
          }}
          onRefresh={() => fetchOrders({ page: 1, per_page: 10, force: true })}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading && <div className="text-center py-8">Loading orders...</div>}

        {!loading && filteredAndSortedList.length === 0 && (
          <div className="text-center p-8 bg-bgSurface rounded-lg border">
            No orders found
          </div>
        )}

        {filteredAndSortedList.map((order) => (
          <OrderCard key={order.unid ?? order.id} order={order} />
        ))}
      </div>

      {/* ----------------------------------
          PAGINATION (BACKEND DRIVEN)
      ---------------------------------- */}
      {meta &&
        (meta.current_page ?? meta.currentPage) <
          (meta.last_page ?? meta.lastPage) && (
          <div className="mt-6 flex justify-center">
            <button
              className="px-4 py-2 border rounded-md"
              onClick={() =>
                fetchOrders({
                  page: (meta.current_page ?? meta.currentPage) + 1,
                  per_page: 10,
                })
              }
            >
              Load more
            </button>
          </div>
        )}
    </div>
  );
}
