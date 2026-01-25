"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useOrderFromList from "@/modules/user/hooks/useOrderFromList";
import OrderDetailsPane from "@/modules/user/dashboard/order/OrderDetailsPane";

export default function OrderDetailRoutePage() {
  const { orderId } = useParams();
  const router = useRouter();

  const { order: storeOrder, getOrderWithFallback } = useOrderFromList(orderId);

  const [hydratedOrder, setHydratedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  const finalOrder = storeOrder ?? hydratedOrder;

  /* ----------------------------------
     1️⃣ SessionStorage hydration
  ---------------------------------- */
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("selectedOrder");
      if (!raw) return;

      const parsed = JSON.parse(raw);
      const key = parsed?.unid ?? parsed?.id;

      if (String(key) === String(orderId)) {
        setHydratedOrder(parsed);
      }
    } catch {}
  }, [orderId]);

  /* ----------------------------------
     2️⃣ Fallback fetch (only if missing)
  ---------------------------------- */
  useEffect(() => {
    if (storeOrder || hydratedOrder) return;

    setLoading(true);
    getOrderWithFallback({ fallbackFetch: true })
      .then((o) => o && setHydratedOrder(o))
      .finally(() => setLoading(false));
  }, [storeOrder, hydratedOrder, getOrderWithFallback]);

  /* ----------------------------------
     3️⃣ Phase–4: Live revalidation
  ---------------------------------- */
  useEffect(() => {
    if (!finalOrder) return;

    const status = (finalOrder.status ?? "").toLowerCase();
    if (["delivered", "cancelled"].includes(status)) return;

    const interval = setInterval(() => {
      getOrderWithFallback({
        fallbackFetch: true,
        force: true,
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [finalOrder, getOrderWithFallback]);

  /* ----------------------------------
     UI
  ---------------------------------- */
  if (loading && !finalOrder) {
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

  if (!finalOrder) return null;

  return (
    <div className="px-0 lg:px-4">
      <button
        onClick={() => router.back()}
        className="mb-4 px-3 py-2 border rounded-md"
      >
        ← Back
      </button>

      <OrderDetailsPane order={finalOrder} />
    </div>
  );
}
