"use client";

import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadOrders,
  selectOrdersData,
  selectOrdersLoading,
  selectOrdersMeta,
} from "@/modules/user/store/orderReducer";

export default function useOrders() {
  const dispatch = useDispatch();

  const list = useSelector(selectOrdersData);
  const loading = useSelector(selectOrdersLoading);
  const meta = useSelector(selectOrdersMeta);

  const fetchOrders = useCallback(
    async (opts = {}) => {
      return dispatch(
        loadOrders({
          page: opts.page ?? 1,
          per_page: opts.per_page ?? 10,
          silent: opts.silent ?? false,

          // 🔥🔥🔥 CRITICAL FIX
          _t: Date.now(), // cache bust
        }),
      );
    },
    [dispatch],
  );

  return {
    list,
    loading,
    meta,
    fetchOrders,
  };
}
