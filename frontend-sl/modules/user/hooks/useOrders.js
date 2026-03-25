"use client";

import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadOrders,
  selectOrdersData,
  selectOrdersLoading,
  selectOrdersMeta,
} from "@/modules/user/store/orderReducer";
import { getSessionTTL, setSessionTTL } from "@/lib/cache/sessionTTL";

/* ----------------------------------
   CONFIG
---------------------------------- */
const CACHE_KEY = "orders_list";
const CACHE_TTL = 120; // seconds

export default function useOrders() {
  const dispatch = useDispatch();

  const list = useSelector(selectOrdersData);
  const loading = useSelector(selectOrdersLoading);
  const meta = useSelector(selectOrdersMeta);

  const { lastFetchedAt, hasFetched } = useSelector(
    (state) => state.userOrders.list,
  );

  /* ----------------------------------
     TTL CHECK
  ---------------------------------- */
  const isFresh = useMemo(() => {
    if (!lastFetchedAt) return false;
    const now = Math.floor(Date.now() / 1000);
    return now - lastFetchedAt < CACHE_TTL;
  }, [lastFetchedAt]);

  /* ----------------------------------
     SMART FETCH (CACHE + TTL)
  ---------------------------------- */
  const fetchOrders = useCallback(
    async (opts = { page: 1, per_page: 10, force: false, silent: false }) => {
      const page = opts.page ?? 1;

      // ✅ ONLY BLOCK FIRST PAGE
      if (!opts.force && hasFetched && isFresh && page === 1) {
        return { skipped: "fresh-redux" };
      }

      // ✅ ONLY CACHE FIRST PAGE
      if (!hasFetched && !opts.force && page === 1) {
        const cached = getSessionTTL(CACHE_KEY);
        if (Array.isArray(cached)) {
          dispatch({
            type: "userOrders/loadOrders/fulfilled",
            payload: {
              list: cached,
              meta: null,
              params: opts,
            },
          });
          return { skipped: "session-cache" };
        }
      }

      const action = await dispatch(
        loadOrders({
          page,
          per_page: opts.per_page ?? 10,
          silent: opts.silent,
        }),
      );

      if (action?.payload?.list && page === 1) {
        setSessionTTL(CACHE_KEY, action.payload.list, CACHE_TTL);
      }

      return action;
    },
    [dispatch, hasFetched, isFresh],
  );

  return {
    list,
    loading,
    meta,
    fetchOrders,
    hasFetched,
    isFresh,
  };
}
