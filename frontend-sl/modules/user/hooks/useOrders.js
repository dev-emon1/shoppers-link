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
      // 1️⃣ Redux data already fresh → skip
      if (!opts.force && hasFetched && isFresh) {
        return { skipped: "fresh-redux" };
      }

      // 2️⃣ Try session cache (only first time)
      if (!hasFetched && !opts.force) {
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

      // 3️⃣ Real API call
      const action = await dispatch(
        loadOrders({
          page: opts.page ?? 1,
          per_page: opts.per_page ?? 10,
          silent: opts.silent,
        }),
      );

      // 4️⃣ Sync to session cache
      if (action?.payload?.list) {
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
