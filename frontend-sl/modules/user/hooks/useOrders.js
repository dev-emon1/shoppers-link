// modules/user/hooks/useOrders.js
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
    (opts = { page: 1, per_page: 10, extraParams: {} }) => {
      return dispatch(
        loadOrders({
          page: opts.page ?? 1,
          per_page: opts.per_page ?? 10,
          ...opts.extraParams,
        })
      );
    },
    [dispatch]
  );

  return { list, loading, meta, fetchOrders };
}
