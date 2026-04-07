"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
<<<<<<< HEAD
import { updateOrderLocally } from "@/modules/user/store/orderReducer";
import { connectSocket, disconnectSocket } from "@/lib/realtime/socket";
=======
import {
  updateOrderLocally,
  addNewOrder,
} from "@/modules/user/store/orderReducer";
import { connectSocket, disconnectSocket } from "@/lib/realtime/socket";
import useOrders from "@/modules/user/hooks/useOrders";
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b

export default function useOrderRealtime() {
  const dispatch = useDispatch();
  const [connected, setConnected] = useState(false);
<<<<<<< HEAD

  useEffect(() => {
    connectSocket(
      (event) => {
        if (event?.type !== "order.updated") return;

        const order = event.order;
        if (!order?.unid) return;

        dispatch(
          updateOrderLocally({
            orderUnidOrId: order.unid,
            patch: order,
          }),
        );
=======
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
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
      },
      (status) => {
        setConnected(status);
      },
    );

    return () => {
      disconnectSocket();
    };
<<<<<<< HEAD
  }, [dispatch]);
=======
  }, [dispatch, fetchOrders, ENABLE_SOCKET]);
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b

  return {
    isSocketConnected: connected,
  };
}
