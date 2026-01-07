// app/user/dashboard/orders/[orderId]/page.js
"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useOrderFromList from "@/modules/user/hooks/useOrderFromList";
import OrderDetailsPane from "@/modules/user/dashboard/order/OrderDetailsPane";

export default function OrderDetailRoutePage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.orderId;
  const { order: storeOrder, getOrderWithFallback } = useOrderFromList(orderId);

  const [immediateOrder, setImmediateOrder] = useState(null);

  useEffect(() => {
    // try sessionStorage first for immediate render
    try {
      const raw = sessionStorage.getItem("selectedOrder");
      if (raw) {
        const parsed = JSON.parse(raw);
        // ensure it matches route param (unid or id)
        const key = parsed?.unid ?? parsed?.id;
        if (key && key.toString() === (orderId ?? "").toString()) {
          setImmediateOrder(parsed);
        } else {
          // if different, clear it
          sessionStorage.removeItem("selectedOrder");
        }
      }
    } catch (e) {
      // ignore parse errors
    }

    // ensure store/list is populated (fallbackFetch will dispatch loadOrders if needed)
    getOrderWithFallback({ fallbackFetch: true }).catch(() => {});
  }, [orderId, getOrderWithFallback]);

  // use storeOrder if available, else immediateOrder
  const finalOrder = storeOrder ?? immediateOrder;
  if (!finalOrder) {
    return (
      <div className="p-4">
        <button
          onClick={() => router.back()}
          className="mb-4 px-3 border rounded-md"
        >
          ← Back
        </button>
        <div>Loading order...</div>
      </div>
    );
  }

  return (
    <div className="px-4">
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
