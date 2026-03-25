"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  updateOrderLocally,
  addNewOrder,
} from "@/modules/user/store/orderReducer";
import { connectSocket, disconnectSocket } from "@/lib/realtime/socket";
import useOrders from "@/modules/user/hooks/useOrders";

export default function useOrderRealtime() {
  const dispatch = useDispatch();
  const [connected, setConnected] = useState(false);
  const { fetchOrders } = useOrders();

  const ENABLE_SOCKET = process.env.NEXT_PUBLIC_ENABLE_SOCKET === "true";

  useEffect(() => {
    // ❌ SOCKET DISABLED
    if (!ENABLE_SOCKET) {
      return;
    }

    connectSocket(
      (event) => {
        if (!event) return;

        if (event.type === "order.updated") {
          const order = event.order;
          if (!order?.unid) return;

          dispatch(
            updateOrderLocally({
              orderUnidOrId: order.unid,
              patch: order,
            }),
          );
        }

        if (event.type === "order.created") {
          const order = event.order;
          if (!order?.unid) return;

          dispatch(addNewOrder(order));

          fetchOrders({
            page: 1,
            per_page: 10,
            force: true,
            silent: true,
          });
        }
      },
      (status) => {
        setConnected(status);
      },
    );

    return () => {
      disconnectSocket();
    };
  }, [dispatch, fetchOrders, ENABLE_SOCKET]);

  return {
    isSocketConnected: connected,
  };
}
