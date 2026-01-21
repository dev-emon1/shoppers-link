"use client";

import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { Calendar, CreditCard, ChevronRight } from "lucide-react";

import useOrders from "@/modules/user/hooks/useOrders";
import { makeImageUrl } from "@/lib/utils/image";
import { getSessionTTL, setSessionTTL } from "@/lib/cache/sessionTTL";
import StatusBadge from "@/modules/user/dashboard/order/StatusBadge";

/* ----------------------------------
   CONFIG
---------------------------------- */
const CACHE_KEY = "recent_orders";
const CACHE_TTL = 120;

/* ----------------------------------
   IMAGE HANDLER
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
     DATA HYDRATION
  ---------------------------------- */
  useEffect(() => {
    if (!user?.id) return;
    if (Array.isArray(list) && list.length > 0) return;

    const cached = getSessionTTL(CACHE_KEY);
    if (cached && Array.isArray(cached)) {
      fetchOrders({ page: 1, per_page: 10 });
      return;
    }

    fetchOrders({ page: 1, per_page: 10 });
  }, [user, list, fetchOrders]);

  /* ----------------------------------
     SYNC TO SESSION
  ---------------------------------- */
  useEffect(() => {
    if (Array.isArray(list) && list.length > 0) {
      setSessionTTL(CACHE_KEY, list, CACHE_TTL);
    }
  }, [list]);

  /* ----------------------------------
     LATEST 5 ORDERS
  ---------------------------------- */
  const recentOrders = useMemo(() => {
    if (!Array.isArray(list)) return [];
    return [...list]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 5);
  }, [list]);

  /* ----------------------------------
     STATES
  ---------------------------------- */
  if (loading && recentOrders.length === 0) {
    return (
      <p className="text-gray-500 text-center py-6">Loading recent orders…</p>
    );
  }

  if (!recentOrders.length) {
    return (
      <p className="text-gray-500 text-center py-6">
        You have no recent orders.
      </p>
    );
  }

  /* ----------------------------------
     RENDER
  ---------------------------------- */
  return (
    <div className="space-y-3">
      {recentOrders.map((order) => (
        <div
          key={order.unid}
          className="border rounded-xl p-4 hover:shadow-sm transition"
        >
          <div className="flex gap-4">
            {/* IMAGE */}
            <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border bg-gray-50">
              <img
                src={getOrderThumbnail(order)}
                alt="product"
                className="w-full h-full object-cover"
              />
            </div>

            {/* CONTENT */}
            <div className="flex-1">
              {/* TOP ROW */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID: {order.unid}
                  </p>
                  <p className="font-semibold mt-1">৳ {order.total_amount}</p>
                </div>

                <StatusBadge status={order.status} />
              </div>

              {/* META + CTA */}
              <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                </div>

                <Link
                  prefetch
                  href={`/user/dashboard/orders/${order.unid}`}
                  className="inline-flex items-center gap-1 text-main font-medium hover:underline"
                >
                  View details <ChevronRight size={14} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
