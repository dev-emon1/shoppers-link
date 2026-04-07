"use client";

<<<<<<< HEAD
import React, { useEffect, useMemo, useState } from "react";
=======
import React, { useEffect, useMemo, useState, useRef } from "react";
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
import useOrders from "@/modules/user/hooks/useOrders";
import OrdersToolbar from "./OrdersToolbar";
import OrderCard from "./OrderCard";
import useDebounce from "@/lib/hooks/useDebounce";
<<<<<<< HEAD
import useOrderRealtime from "@/modules/user/hooks/useOrderRealtime";

export default function OrdersPageComponent() {
  useOrderRealtime();
  const { list, loading, fetchOrders, meta } = useOrders();
=======
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
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState("latest");

  const debouncedQuery = useDebounce(query, 300);

  /* ----------------------------------
     PHASE–4: Silent background refresh
     (runs on mount)
  ---------------------------------- */
  useEffect(() => {
<<<<<<< HEAD
    fetchOrders({
      page: 1,
      per_page: 10,
      silent: true,
    });
  }, [fetchOrders]);
=======
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
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b

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
<<<<<<< HEAD
      {/* TOOLBAR */}
=======
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
      <div className="bg-white border rounded-xl p-4">
        <OrdersToolbar
          onSearch={setQuery}
          onFilter={setStatus}
<<<<<<< HEAD
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
=======
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
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
    </div>
  );
}
