import { useCallback, useMemo } from "react";
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
  const lastFetchedAt = useSelector(
    (state) => state.userOrders.list.lastFetchedAt,
  );

  /* -------------------------------
     TTL CHECK (2 minutes)
  -------------------------------- */
  const isFresh = useMemo(() => {
    if (!lastFetchedAt) return false;
    const now = Math.floor(Date.now() / 1000);
    return now - lastFetchedAt < 120;
  }, [lastFetchedAt]);

  /* -------------------------------
     SMART FETCH
  -------------------------------- */
  const fetchOrders = useCallback(
    (opts = { page: 1, per_page: 10, force: false, silent: false }) => {
      if (!opts.force && isFresh && list.length > 0) {
        return Promise.resolve({ skipped: true });
      }

      return dispatch(
        loadOrders({
          page: opts.page ?? 1,
          per_page: opts.per_page ?? 10,
          silent: opts.silent,
        }),
      );
    },
    [dispatch, isFresh, list.length],
  );

  return {
    list,
    loading,
    meta,
    fetchOrders,
    isFresh,
  };
}
