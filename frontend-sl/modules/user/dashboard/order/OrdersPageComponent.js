"use client";

import React, { useEffect, useMemo, useState } from "react";
import useOrders from "@/modules/user/hooks/useOrders";
import OrdersToolbar from "./OrdersToolbar";
import OrderCard from "./OrderCard";
import useDebounce from "@/lib/hooks/useDebounce";
import useOrderRealtime from "@/modules/user/hooks/useOrderRealtime";

export default function OrdersPageComponent() {
  useOrderRealtime();
  const { list, loading, fetchOrders, meta } = useOrders();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("latest");

  const debouncedQuery = useDebounce(query, 300);

  /* ----------------------------------
     PHASE–4: Silent background refresh
     (runs on mount)
  ---------------------------------- */
  useEffect(() => {
    fetchOrders({
      page: 1,
      per_page: 10,
      silent: true,
    });
  }, [fetchOrders]);

  /* ----------------------------------
     PHASE–4: Auto revalidate active orders
  ---------------------------------- */
  useEffect(() => {
    if (!list.length) return;

    const hasActiveOrders = list.some(
      (o) =>
        !["delivered", "cancelled"].includes((o.status ?? "").toLowerCase()),
    );

    if (!hasActiveOrders) return;

    const interval = setInterval(() => {
      fetchOrders({
        page: 1,
        per_page: 10,
        force: true,
        silent: true,
      });
    }, 60000); // 60 sec

    return () => clearInterval(interval);
  }, [fetchOrders, list]);

  const isColdStart = loading && list.length === 0;

  /* ----------------------------------
     FILTER + SORT
  ---------------------------------- */
  const filteredAndSortedList = useMemo(() => {
    if (!Array.isArray(list)) return [];

    let arr = [...list];

    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      arr = arr.filter((order) => {
        if (order.unid?.toLowerCase().includes(q)) return true;
        return order.vendor_orders?.some((vo) =>
          vo.items?.some((item) =>
            item.product?.name?.toLowerCase().includes(q),
          ),
        );
      });
    }

    if (status) {
      arr = arr.filter((o) => (o.status ?? "").toLowerCase() === status);
    }

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

  return (
    <div className="space-y-5">
      {/* TOOLBAR */}
      <div className="bg-white border rounded-xl p-4">
        <OrdersToolbar
          onSearch={setQuery}
          onFilter={setStatus}
          onSort={setSort}
          onRefresh={() =>
            fetchOrders({
              page: 1,
              per_page: 10,
              force: true,
            })
          }
        />
      </div>

      {/* COLD START LOADER */}
      {isColdStart && (
        <div className="text-center py-10 text-gray-500">
          Loading your orders…
        </div>
      )}

      {/* EMPTY STATE */}
      {!isColdStart && filteredAndSortedList.length === 0 && (
        <div className="text-center p-10 bg-bgSurface border rounded-xl">
          <p className="text-gray-600 font-medium">No orders found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try changing search or filters
          </p>
        </div>
      )}

      {/* BACKGROUND UPDATE INDICATOR */}
      {loading && list.length > 0 && (
        <p className="text-xs text-gray-400 text-center">Updating orders…</p>
      )}

      {/* ORDER LIST */}
      <div className="space-y-4">
        {filteredAndSortedList.map((order) => (
          <OrderCard key={order.unid ?? order.id} order={order} />
        ))}
      </div>

      {/* PAGINATION */}
      {meta &&
        (meta.current_page ?? meta.currentPage) <
          (meta.last_page ?? meta.lastPage) && (
          <div className="flex justify-center pt-4">
            <button
              onClick={() =>
                fetchOrders({
                  page: (meta.current_page ?? meta.currentPage) + 1,
                  per_page: 10,
                })
              }
              className="px-6 py-2 border rounded-lg text-sm font-medium hover:bg-gray-100 transition"
            >
              Load more orders
            </button>
          </div>
        )}
    </div>
  );
}
