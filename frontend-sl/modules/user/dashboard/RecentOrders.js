"use client";

import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
<<<<<<< HEAD
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
=======
import { Calendar, ChevronRight } from "lucide-react";

import useOrders from "@/modules/user/hooks/useOrders";
import { makeImageUrl } from "@/lib/utils/image";
import StatusBadge from "@/modules/user/dashboard/order/StatusBadge";

const getOrderThumbnail = (order) => {
  const item = order?.vendor_orders?.[0]?.items?.[0];
  return item ? makeImageUrl(item?.image?.image_path) : "/placeholder.jpg";
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
};

export default function RecentOrders() {
  const { user } = useSelector((state) => state.auth);
  const { list, loading, fetchOrders } = useOrders();

<<<<<<< HEAD
  /* ----------------------------------
     DATA HYDRATION
  ---------------------------------- */
  // useEffect(() => {
  //   if (!user?.id) return;
  //   if (Array.isArray(list) && list.length > 0) return;

  //   const cached = getSessionTTL(CACHE_KEY);
  //   if (cached && Array.isArray(cached)) {
  //     fetchOrders({ page: 1, per_page: 10 });
  //     return;
  //   }

  //   fetchOrders({ page: 1, per_page: 10 });
  // }, [user, list, fetchOrders]);

  const hasFetched = useSelector((state) => state.userOrders.list.hasFetched);

  useEffect(() => {
    if (!user?.id) return;
    if (hasFetched) return; // 🔥 key fix

    fetchOrders({ page: 1, per_page: 10 });
  }, [user?.id, hasFetched, fetchOrders]);

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
  if (!hasFetched && loading) {
=======
  /* 🔥 ALWAYS SAFE FETCH */
  useEffect(() => {
    if (!user?.id) return;

    fetchOrders({
      page: 1,
      per_page: 10,
      silent: list.length > 0,
    });
  }, [user?.id]);

  const recentOrders = useMemo(() => {
    return [...(list || [])]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 5);
  }, [list]);

  if (loading && !list.length) {
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
    return (
      <p className="text-gray-500 text-center py-6">Loading recent orders…</p>
    );
  }

<<<<<<< HEAD
  if (hasFetched && recentOrders.length === 0) {
=======
  if (!loading && recentOrders.length === 0) {
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
    return (
      <p className="text-gray-500 text-center py-6">
        You have no recent orders.
      </p>
    );
  }

<<<<<<< HEAD
  /* ----------------------------------
     RENDER
  ---------------------------------- */
=======
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
  return (
    <div className="space-y-3">
      {recentOrders.map((order) => (
        <div
          key={order.unid}
          className="border rounded-xl p-4 hover:shadow-sm transition"
        >
          <div className="flex gap-4">
<<<<<<< HEAD
            {/* IMAGE */}
            <div className="w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden border bg-gray-50">
              <img
                src={getOrderThumbnail(order)}
                alt="product"
=======
            <div className="w-14 h-14 rounded-lg overflow-hidden border">
              <img
                src={getOrderThumbnail(order)}
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
                className="w-full h-full object-cover"
              />
            </div>

<<<<<<< HEAD
            {/* CONTENT */}
            <div className="flex-1">
              {/* TOP ROW */}
              <div className="flex items-start justify-between">
=======
            <div className="flex-1">
              <div className="flex justify-between">
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID: {order.unid}
                  </p>
                  <p className="font-semibold mt-1">৳ {order.total_amount}</p>
                </div>

                <StatusBadge status={order.status} />
              </div>

<<<<<<< HEAD
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
=======
              <div className="mt-3 flex justify-between text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Calendar size={14} />
                  {new Date(order.created_at).toLocaleDateString()}
                </div>

                <Link
                  href={`/user/dashboard/orders/${order.unid}`}
                  className="flex items-center gap-1 text-main hover:underline"
                >
                  View <ChevronRight size={14} />
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
