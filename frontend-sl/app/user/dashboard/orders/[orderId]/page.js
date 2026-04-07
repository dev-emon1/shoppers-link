"use client";

<<<<<<< HEAD
import React, { useEffect, useState } from "react";
=======
import React, { useEffect, useMemo } from "react";
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
import { useParams, useRouter } from "next/navigation";
import useOrderFromList from "@/modules/user/hooks/useOrderFromList";
import OrderDetailsPane from "@/modules/user/dashboard/order/OrderDetailsPane";
import useSmartPolling from "@/lib/hooks/useSmartPolling";

export default function OrderDetailRoutePage() {
  const { orderId } = useParams();
  const router = useRouter();
<<<<<<< HEAD

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
=======

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
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
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

<<<<<<< HEAD
  if (!finalOrder) return null;
=======
  if (!order) return null;
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b

  return (
    <div className="px-0 lg:px-4">
      <button
        onClick={() => router.back()}
        className="mb-4 px-3 py-2 border rounded-md"
      >
        ← Back
      </button>

<<<<<<< HEAD
      <OrderDetailsPane order={finalOrder} />
=======
      <OrderDetailsPane order={order} />
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
    </div>
  );
}
