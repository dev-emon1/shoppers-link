"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import useOrders from "@/modules/user/hooks/useOrders";
import OrdersToolbar from "./OrdersToolbar";
import OrderCard from "./OrderCard";
import useDebounce from "@/lib/hooks/useDebounce";
import useSmartPolling from "@/lib/hooks/useSmartPolling";
import { usePathname } from "next/navigation";

export default function OrdersPageComponent() {
  const { list, loading, fetchOrders, meta } = useOrders();
  const pathname = usePathname();

  const currentPage = meta?.current_page ?? 1;
  const lastPage = meta?.last_page ?? 1;
  const hasMore = currentPage < lastPage;

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [highlightId, setHighlightId] = useState(null);

  const debouncedQuery = useDebounce(query, 300);

  const isFetchingRef = useRef(false);

  /* 🔥 SAFE FETCH (NO TTL) */
  const safeFetch = async () => {
    if (isFetchingRef.current) return;

    isFetchingRef.current = true;

    try {
      console.log("🔥 Fetching latest orders...");
      await fetchOrders({ page: 1 });
    } finally {
      isFetchingRef.current = false;
    }
  };

  /* 🔥 INITIAL LOAD */
  useEffect(() => {
    safeFetch();
  }, []);

  /* 🔥 NAVIGATION REFRESH */
  useEffect(() => {
    safeFetch();
  }, [pathname]);

  /* 🔥 POLLING */
  const hasActiveOrders = useMemo(() => {
    return list.some((o) =>
      ["pending", "confirmed", "processing", "shipped"].includes(
        (o.status ?? "").toLowerCase(),
      ),
    );
  }, [list]);

  useSmartPolling({
    enabled: hasActiveOrders,
    callback: safeFetch,
    fastInterval: 15000,
    slowInterval: 60000,
  });

  /* 🔥 NEW ORDER DETECT */
  const prevFirstIdRef = useRef(null);

  const newOrderId = useMemo(() => {
    if (!list?.length) return null;

    const current = list[0]?.unid;

    if (!prevFirstIdRef.current) {
      prevFirstIdRef.current = current;
      return null;
    }

    if (prevFirstIdRef.current !== current) {
      prevFirstIdRef.current = current;
      return current;
    }

    return null;
  }, [list]);

  useEffect(() => {
    if (!newOrderId) return;

    setHighlightId(newOrderId);

    const el = document.getElementById(`order-${newOrderId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    const t = setTimeout(() => setHighlightId(null), 4000);
    return () => clearTimeout(t);
  }, [newOrderId]);

  /* FILTER */
  const filteredList = useMemo(() => {
    let arr = [...list];

    if (debouncedQuery) {
      arr = arr.filter((o) =>
        o.unid?.toLowerCase().includes(debouncedQuery.toLowerCase()),
      );
    }

    if (status) {
      arr = arr.filter((o) => o.status === status);
    }

    return arr.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [list, debouncedQuery, status]);

  const isColdStart = loading && list.length === 0;

  return (
    <div className="space-y-5">
      <div className="bg-white border rounded-xl p-4">
        <OrdersToolbar
          onSearch={setQuery}
          onFilter={setStatus}
          onRefresh={safeFetch}
        />
      </div>

      {isColdStart && (
        <div className="text-center py-10">Loading your orders...</div>
      )}

      {loading && list.length > 0 && (
        <p className="text-xs text-gray-400 text-center">Updating orders...</p>
      )}

      {filteredList.length === 0 && !isColdStart && (
        <div className="text-center p-10">No orders found</div>
      )}

      <div className="space-y-4">
        {filteredList.map((order) => (
          <OrderCard
            key={order.unid}
            order={order}
            isNew={order.unid === highlightId}
          />
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => fetchOrders({ page: currentPage + 1 })}
          className="px-4 py-2 border rounded-md"
        >
          Load more
        </button>
      )}
    </div>
  );
}
