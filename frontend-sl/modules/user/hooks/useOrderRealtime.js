"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateOrderLocally } from "@/modules/user/store/orderReducer";
import { connectSocket, disconnectSocket } from "@/lib/realtime/socket";

export default function useOrderRealtime() {
  const dispatch = useDispatch();
  const [connected, setConnected] = useState(false);

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
      },
      (status) => {
        setConnected(status);
      },
    );

    return () => {
      disconnectSocket();
    };
  }, [dispatch]);

  return {
    isSocketConnected: connected,
  };
}
