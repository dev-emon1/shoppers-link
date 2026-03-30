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

        <button
          onClick={() => router.push("/user/dashboard/orders")}
          className="mt-4 px-4 py-2 bg-main text-white rounded"
        >
          View Orders
        </button>
      </div>
    </div>
  );
}
