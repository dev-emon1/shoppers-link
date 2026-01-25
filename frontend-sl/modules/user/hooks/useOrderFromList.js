// modules/user/hooks/useOrderFromList.js
import { useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadOrders,
  cancelOrder,
  seedDetailsFromList,
  selectOrderDetailsByUnid,
  selectOrdersData,
  selectOrdersLoading,
  selectIsCancelling,
} from "@/modules/user/store/orderReducer";

export const useOrderFromList = (orderId) => {
  const dispatch = useDispatch();
  const key = orderId;

  // selectors
  const detailsEntry = useSelector((state) =>
    selectOrderDetailsByUnid(state, key),
  );
  const list = useSelector(selectOrdersData);
  const loading = useSelector(selectOrdersLoading);
  const cancelling = useSelector((state) => selectIsCancelling(state, key));

  // derive order object (prefer details map)
  const order = useMemo(() => {
    if (detailsEntry && detailsEntry.data) return detailsEntry.data;
    if (Array.isArray(list)) {
      return (
        list.find((x) => x.unid === key || String(x.id) === String(key)) ?? null
      );
    }
    return null;
  }, [detailsEntry, list, key]);

  // refresh helper (reload first page or user-provided page)
  const refresh = useCallback(
    (opts = { page: 1, per_page: 10, extraParams: {} }) => {
      return dispatch(
        loadOrders({
          page: opts.page,
          per_page: opts.per_page,
          ...opts.extraParams,
        }),
      );
    },
    [dispatch],
  );

  // seed details map from list (safe, idempotent)
  const ensureSeeded = useCallback(() => {
    if (!detailsEntry || !detailsEntry.data) {
      dispatch(seedDetailsFromList());
    }
  }, [dispatch, detailsEntry]);

  // cancel function
  const doCancelSafe = useCallback(
    (payload = { reason: null }) => {
      const oId = order?.id;
      if (!oId) return Promise.reject(new Error("No order id provided"));
      return dispatch(
        cancelOrder({ orderId: oId, reason: payload.reason }),
      ).unwrap();
    },
    [dispatch, key, order],
  );

  /**
   * getOrderWithFallback
   * - options:
   *    { fallbackFetch: boolean, page, per_page, extraParams }
   * Behavior:
   *  - If the order is already present in store (details map or list), resolves immediately with it.
   *  - Else if fallbackFetch===true, dispatches loadOrders (page/per_page) and waits,
   *    then resolves with the found order (or null).
   *  - Returns a Promise (so callers can await .catch())
   */
  const getOrderWithFallback = useCallback(
    async (
      opts = { fallbackFetch: false, page: 1, per_page: 10, extraParams: {} },
    ) => {
      // quick check
      if (order) return order;

      // ensure seed so detail map may be filled
      ensureSeeded();

      if (!opts?.fallbackFetch) {
        return null;
      }

      try {
        // dispatch loadOrders; wait for completion
        const action = await dispatch(
          loadOrders({
            page: opts.page ?? 1,
            per_page: opts.per_page ?? 10,
            ...opts.extraParams,
          }),
        );
        // action.payload should contain { list, meta, params } per our reducer contract
        const payload = action.payload ?? null;
        const listAfter =
          payload?.list ??
          (Array.isArray(action?.payload) ? action.payload : null);

        // try find order in newly loaded list
        let found = null;
        if (Array.isArray(listAfter)) {
          found = listAfter.find(
            (x) => x.unid === key || String(x.id) === String(key),
          );
        }

        // fallback: also check current store as reducer seeded detailsByUnid
        if (!found) {
          const state = (dispatch.getState && dispatch.getState()) || null;
          if (state && state.userOrders && state.userOrders.detailsByUnid) {
            const entry = state.userOrders.detailsByUnid[key];
            if (entry && entry.data) found = entry.data;
          }
        }

        return found ?? null;
      } catch (err) {
        // bubble up so caller can handle
        throw err;
      }
    },
    [dispatch, ensureSeeded, key, order],
  );

  return {
    order,
    doCancelSafe,
    cancelling,
    loading,
    refresh,
    ensureSeeded,
    getOrderWithFallback,
  };
};

export default useOrderFromList;
