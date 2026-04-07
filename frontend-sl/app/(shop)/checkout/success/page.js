"use client";

import { CheckCircle2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import api from "@/core/api/axiosClient";
import { useDispatch } from "react-redux";
import { addNewOrder, loadOrders } from "@/modules/user/store/orderReducer";

export default function CheckoutSuccessPage() {
  const sp = useSearchParams();
  const orderId = sp.get("order_id");

  const dispatch = useDispatch();
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const hasDispatchedRef = useRef(false);

  useEffect(() => {
    if (!orderId) return;

    let mounted = true;

    const fetchOrder = async () => {
      let attempts = 0;

      while (attempts < 5) {
        try {
          const res = await api.get(`/customer/order/${orderId}`);
          const data = res?.data?.data || res?.data;

          if (data?.unid && mounted) {
            setOrder(data);

            if (!hasDispatchedRef.current) {
              hasDispatchedRef.current = true;

              // ✅ instant UI
              dispatch(addNewOrder(data));

              // 🔥 SMART BACKEND SYNC (no vanish)
              let retry = 0;

              const sync = async () => {
                while (retry < 5) {
                  const action = await dispatch(
                    loadOrders({ page: 1, silent: true }),
                  );

                  const list = action.payload?.list || [];

                  const found = list.some((o) => o.unid === data.unid);

                  if (found) break;

                  await new Promise((r) => setTimeout(r, 1500));
                  retry++;
                }
              };

              sync();
            }

            break;
          }
        } catch {}

        await new Promise((r) => setTimeout(r, 800));
        attempts++;
      }
    };

    fetchOrder();

    return () => {
      mounted = false;
    };
  }, [orderId, dispatch]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <CheckCircle2 size={60} className="mx-auto text-green-500" />
        <h1 className="text-xl mt-4">Order placed successfully</h1>

        {order && <p className="mt-2">Order ID: {order.unid}</p>}

<<<<<<< HEAD
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
            prefetch
          >
            View Orders
          </Link>

          <Link
            href="/"
            className="text-main underline text-sm hover:text-main/80 transition"
            prefetch
          >
            Continue Shopping →
          </Link>
        </div>
=======
        <button
          onClick={() => router.push("/user/dashboard/orders")}
          className="mt-4 px-4 py-2 bg-main text-white rounded"
        >
          View Orders
        </button>
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
      </div>
    </div>
  );
}
