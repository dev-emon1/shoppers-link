"use client";

import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import api from "@/core/api/axiosClient";
import { useDispatch } from "react-redux";
import { addNewOrder, loadOrders } from "@/modules/user/store/orderReducer";

export default function CheckoutSuccessPage() {
  const sp = useSearchParams();
  const ref = sp.get("ref");
  const orderId = sp.get("order_id");

  const dispatch = useDispatch();
  const router = useRouter();

  const [orders, setOrders] = useState(null);
  const [loading, setLoading] = useState(true);

  const hasProcessedRef = useRef(false);

  const fetchOrder = async () => {
    if (!orderId || hasProcessedRef.current) return;

    try {
      const { data } = await api.get(`/customer/order/${orderId}`);
      const order = data;

      setOrders([order]);
      hasProcessedRef.current = true;

      // ✅ ONLY THIS (no force fetch here)
      dispatch(addNewOrder(order));
    } catch (err) {
      console.error("Order fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm max-w-lg w-full text-center border border-border">
        <CheckCircle2 className="text-emerald-500 mx-auto mb-5" size={60} />

        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
          Order placed successfully!
        </h1>

        <p className="text-sm text-gray-600 mb-4">
          Thank you for shopping with{" "}
          <span className="font-medium">ShoppersLink</span>.
        </p>

        {/* REF */}
        {ref && (
          <div className="bg-gray-100 rounded-lg py-3 px-4 mb-5">
            <p className="text-xs text-gray-500">Checkout Reference</p>
            <p className="text-lg font-semibold tracking-wide">{ref}</p>
          </div>
        )}

        {/* ORDER INFO */}
        {!loading && orders && (
          <div className="text-sm text-gray-700 mb-4">
            Your order ID:{" "}
            <span className="font-semibold">{orders[0]?.unid}</span>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <p className="text-xs text-gray-500 mb-4">Fetching your order...</p>
        )}

        {/* ACTIONS */}
        <div className="flex flex-col gap-3 mt-6">
          {/* 🔥 ONLY HERE force fetch */}
          <button
            onClick={async () => {
              await dispatch(
                loadOrders({
                  page: 1,
                  force: true,
                }),
              );

              router.push("/user/dashboard/orders");
            }}
            className="bg-main text-white py-2 rounded-lg hover:bg-main/90"
          >
            View Orders
          </button>

          <Link href="/" className="text-main underline text-sm">
            Continue Shopping →
          </Link>
        </div>
      </div>
    </div>
  );
}
