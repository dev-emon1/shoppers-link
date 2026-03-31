"use client";

import React, { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import useOrderFromList from "@/modules/user/hooks/useOrderFromList";
import OrderDetailsPane from "@/modules/user/dashboard/order/OrderDetailsPane";
import useSmartPolling from "@/lib/hooks/useSmartPolling";

export default function OrderDetailRoutePage() {
  const { orderId } = useParams();
  const router = useRouter();

  const { order, getOrderWithFallback, loading } = useOrderFromList(orderId);

  /* ----------------------------------
     INITIAL FETCH (ALWAYS)
  ---------------------------------- */
  useEffect(() => {
    getOrderWithFallback({
      fallbackFetch: true,
      force: true,
    });
  }, [orderId, getOrderWithFallback]);

  /* ----------------------------------
     ACTIVE CHECK
  ---------------------------------- */
  const isActive = useMemo(() => {
    if (!order) return false;
    const s = (order.status ?? "").toLowerCase();
    return !["delivered", "cancelled"].includes(s);
  }, [order]);

  /* ----------------------------------
     SMART POLLING
  ---------------------------------- */
  useSmartPolling({
    enabled: isActive,
    callback: () =>
      getOrderWithFallback({
        fallbackFetch: true,
        force: true,
      }),
    fastInterval: 5000,
    slowInterval: 20000,
  });

  /* ----------------------------------
     UI STATES
  ---------------------------------- */
  if (loading && !order) {
    return (
      <div className="p-4">
        <button
          onClick={() => router.back()}
          className="mb-4 px-3 py-2 border rounded-md"
        >
          ← Back
        </button>
        <div className="text-gray-500">Loading order…</div>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="px-0 lg:px-4">
      <button
        onClick={() => router.back()}
        className="mb-4 px-3 py-2 border rounded-md"
      >
        ← Back
      </button>

      <OrderDetailsPane order={order} />
    </div>
  );
}
