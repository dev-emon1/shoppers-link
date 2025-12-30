"use client";

import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { Calendar, CreditCard, ChevronRight } from "lucide-react";

import useOrders from "@/modules/user/hooks/useOrders";
import { makeImageUrl } from "@/lib/utils/image";
import { getSessionTTL, setSessionTTL } from "@/lib/cache/sessionTTL";

/* ----------------------------------
   CONFIG
---------------------------------- */
const CACHE_KEY = "recent_orders";
const CACHE_TTL = 120; // seconds

/* ----------------------------------
   IMAGE HANDLER (SAME AS OrderCard)
---------------------------------- */
const getOrderThumbnail = (order) => {
  const primaryItem = order?.vendor_orders?.[0]?.items?.[0];

  if (!primaryItem) return "/placeholder-image.jpg";

  return makeImageUrl(primaryItem?.image?.image_path);
};

export default function RecentOrders() {
  const { user } = useSelector((state) => state.auth);
  const { list, loading, fetchOrders } = useOrders();

  /* ----------------------------------
     HYDRATION LOGIC
  ---------------------------------- */
  useEffect(() => {
    if (!user?.id) return;

    // 1️⃣ Redux already has data
    if (Array.isArray(list) && list.length > 0) return;

    // 2️⃣ Session cache (TTL based)
    const cached = getSessionTTL(CACHE_KEY);
    if (cached && Array.isArray(cached)) {
      // redux empty but cache exists → fetch once (no UX lag)
      fetchOrders({ page: 1, per_page: 10 });
      return;
    }

    // 3️⃣ Final fallback → API
    fetchOrders({ page: 1, per_page: 10 });
  }, [user, list, fetchOrders]);

  /* ----------------------------------
     REDUX → SESSION SYNC
  ---------------------------------- */
  useEffect(() => {
    if (Array.isArray(list) && list.length > 0) {
      setSessionTTL(CACHE_KEY, list, CACHE_TTL);
    }
  }, [list]);

  /* ----------------------------------
     DERIVE LATEST 5 ORDERS
  ---------------------------------- */
  const recentOrders = useMemo(() => {
    if (!Array.isArray(list)) return [];
    return [...list]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5);
  }, [list]);

  /* ----------------------------------
     UI STATES
  ---------------------------------- */
  const statusColors = {
    delivered: "bg-green/10 text-green",
    processing: "bg-yellow/10 text-yellow",
    cancelled: "bg-red/10 text-red",
    pending: "bg-gray-100 text-gray-500",
  };

  if (loading && recentOrders.length === 0)
    return (
      <p className="text-gray-500 text-center mt-5">Loading recent orders...</p>
    );

  if (!recentOrders.length)
    return (
      <p className="text-gray-500 text-center mt-5">
        You have no recent orders.
      </p>
    );

  /* ----------------------------------
     RENDER
  ---------------------------------- */
  return (
    <div className="space-y-2">
      {recentOrders.map((order) => (
        <div
          key={order.unid}
          className="bg-white p-4 rounded-xl shadow-sm border transition"
        >
          <div className="flex gap-4 items-start">
            {/* LEFT : IMAGE */}
            <div className="w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border bg-gray-50">
              <img
                src={getOrderThumbnail(order)}
                alt={
                  order?.vendor_orders?.[0]?.items?.[0]?.product?.name ??
                  "product"
                }
                className="w-full h-full object-cover"
              />
            </div>

            {/* RIGHT : CONTENT */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-sm">{order.unid}</h3>

                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                    statusColors[order.status?.toLowerCase()] ??
                    "bg-gray-100 text-gray-500"
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <CreditCard size={14} />
                  <span>৳ {order.total_amount}</span>
                </div>

                <div className="flex justify-end">
                  <Link
                    href={`/user/dashboard/orders/${order.unid}`}
                    className="flex items-center gap-1 text-main font-medium hover:underline"
                  >
                    View <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
