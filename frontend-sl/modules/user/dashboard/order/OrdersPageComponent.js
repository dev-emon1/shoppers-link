"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import useOrders from "@/modules/user/hooks/useOrders";
import OrdersToolbar from "./OrdersToolbar";
import OrderCard from "./OrderCard";
import useDebounce from "@/lib/hooks/useDebounce";

export default function OrdersPageComponent() {
  const { list, loading, fetchOrders, hasFetched, meta } = useOrders();

  const currentPage = meta?.current_page ?? 1;
  const lastPage = meta?.last_page ?? 1;
  const hasMore = currentPage < lastPage;

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("latest");
  const [highlightId, setHighlightId] = useState(null);

  const debouncedQuery = useDebounce(query, 300);

  // New order detection (polling)
  const prevFirstIdRef = useRef(null);

  const newOrderId = useMemo(() => {
    if (!list.length) return null;

    const currentFirst = list[0]?.unid;

    if (!prevFirstIdRef.current) {
      prevFirstIdRef.current = currentFirst;
      return null;
    }

    if (prevFirstIdRef.current !== currentFirst) {
      prevFirstIdRef.current = currentFirst;
      return currentFirst;
    }

    return null;
  }, [list]);

  useEffect(() => {
    if (!newOrderId) return;

    setHighlightId(newOrderId);

    const el = document.getElementById(`order-${newOrderId}`);
    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
    const t = setTimeout(() => {
      setHighlightId(null);
    }, 4000); // 4 sec glow

    return () => clearTimeout(t);
  }, [newOrderId]);

  /* ----------------------------------
     INITIAL LOAD (smart)
  ---------------------------------- */
  useEffect(() => {
    if (list.length === 0) {
      fetchOrders({
        page: 1,
        per_page: 10,
      });
    }
  }, [fetchOrders, hasFetched, list.length]);

  /* ----------------------------------
     ACTIVE ORDER CHECK
  ---------------------------------- */
  const hasActiveOrders = useMemo(() => {
    if (!Array.isArray(list)) return false;

    return list.some((o) => {
      const s = (o.status ?? "").toLowerCase();
      return ["pending", "confirmed", "processing", "shipped"].includes(s);
    });
  }, [list]);

  /* ----------------------------------
     SMART POLLING (only active orders)
  ---------------------------------- */
  useEffect(() => {
    if (!hasActiveOrders) return;

    const interval = setInterval(() => {
      fetchOrders({
        page: 1,
        per_page: 10,
        force: true,
        silent: true,
      });
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchOrders, hasActiveOrders]);

  /* ----------------------------------
     FILTER + SORT
  ---------------------------------- */
  const filteredList = useMemo(() => {
    if (!Array.isArray(list)) return [];

    let arr = [...list];

    if (debouncedQuery) {
      const q = debouncedQuery.toLowerCase();
      arr = arr.filter((order) => order.unid?.toLowerCase().includes(q));
    }

    if (status) {
      arr = arr.filter((o) => o.status === status);
    }

    return arr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [list, debouncedQuery, status]);

  /* ----------------------------------
     UI
  ---------------------------------- */
  const isColdStart = !hasFetched && loading;

  return (
    <div className="space-y-5">
      <div className="bg-white border rounded-xl p-4">
        <OrdersToolbar
          onSearch={setQuery}
          onFilter={setStatus}
          onSort={setSort}
          onRefresh={() => fetchOrders({ page: 1, force: true })}
        />
      </div>

      {/* FIRST LOAD */}
      {isColdStart && (
        <div className="text-center py-10">Loading your orders...</div>
      )}

      {/* BACKGROUND UPDATE */}
      {loading && hasFetched && (
        <p className="text-xs text-gray-400 text-center">Updating orders...</p>
      )}

      {/* EMPTY */}
      {!isColdStart && filteredList.length === 0 && (
        <div className="text-center p-10">No orders found</div>
      )}

      {/* LIST */}
      <div className="space-y-4">
        {filteredList.map((order) => (
          <OrderCard
            key={order.unid}
            order={order}
            isNew={order.unid === highlightId}
          />
        ))}
      </div>

      {/* PAGINATION */}
      {hasMore && (
        <button onClick={() => fetchOrders({ page: currentPage + 1 })}>
          Load more
        </button>
      )}
    </div>
  );
}
