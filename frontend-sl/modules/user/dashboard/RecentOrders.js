"use client";

import { useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";

import useOrders from "@/modules/user/hooks/useOrders";
import { makeImageUrl } from "@/lib/utils/image";
import StatusBadge from "@/modules/user/dashboard/order/StatusBadge";

const getOrderThumbnail = (order) => {
  const item = order?.vendor_orders?.[0]?.items?.[0];
  return item ? makeImageUrl(item?.image?.image_path) : "/placeholder.jpg";
};

export default function RecentOrders() {
  const { user } = useSelector((state) => state.auth);
  const { list, loading, fetchOrders } = useOrders();

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
    return (
      <p className="text-gray-500 text-center py-6">Loading recent orders…</p>
    );
  }

  if (!loading && recentOrders.length === 0) {
    return (
      <p className="text-gray-500 text-center py-6">
        You have no recent orders.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {recentOrders.map((order) => (
        <div
          key={order.unid}
          className="border rounded-xl p-4 hover:shadow-sm transition"
        >
          <div className="flex gap-4">
            <div className="w-14 h-14 rounded-lg overflow-hidden border">
              <img
                src={getOrderThumbnail(order)}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500">
                    Order ID: {order.unid}
                  </p>
                  <p className="font-semibold mt-1">৳ {order.total_amount}</p>
                </div>

                <StatusBadge status={order.status} />
              </div>

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
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
