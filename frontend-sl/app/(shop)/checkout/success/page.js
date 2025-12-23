"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/core/api/axiosClient";
import { showToast } from "@/lib/utils/toast";

export default function CheckoutSuccessPage() {
  const sp = useSearchParams();
  const ref = sp.get("ref"); // checkout_unid
  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);
  // console.log(orders);

  const orderId = sp.get("order_id");
  const fetchOrders = async () => {
    if (!orderId) return;
    const { data } = await api.get(`/customer/order/${orderId}`);
    setOrders([data]); // wrap in array to keep your existing map logic
    setLoading(false);
  };
  useEffect(() => {
    fetchOrders();
  }, [ref]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm max-w-lg w-full text-center border border-border">
        <CheckCircle2 className="text-emerald-500 mx-auto mb-5" size={60} />

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Order placed successfully!
        </h1>

        <p className="text-sm text-gray-600 mb-4">
          Thank you for shopping with{" "}
          <span className="font-medium">ShoppersLink</span>. Your order has been
          received and is being processed.
        </p>

        {ref && (
          <div className="bg-gray-100 rounded-lg py-3 px-4 mb-5">
            <p className="text-xs text-gray-500">Checkout Reference</p>
            <p className="text-lg font-semibold tracking-wide text-gray-800">
              {ref}
            </p>
          </div>
        )}

        {/* Vendor Count (if available) */}
        {orders && (
          <p className="text-sm text-gray-700 mb-4">
            This checkout contains{" "}
            <span className="font-semibold">{orders?.length}</span> vendor order
            {orders?.length > 1 ? "s" : ""}.
          </p>
        )}

        {loading && (
          <p className="text-xs text-gray-500 mb-4">Loading order details...</p>
        )}

        <div className="flex flex-col gap-3 mt-6">
          <Link
            href="/user/dashboard/orders"
            className="bg-main text-white py-2 rounded-lg hover:bg-main/90 transition"
          >
            View Orders
          </Link>

          <Link
            href="/"
            className="text-main underline text-sm hover:text-main/80 transition"
          >
            Continue Shopping →
          </Link>
        </div>
      </div>
    </div>
  );
}
