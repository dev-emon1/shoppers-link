"use client";

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNewArrivals } from "../store/homeReducer";

const isCacheValid = (lastFetched, ttl) => {
  if (!lastFetched) return false;
  return Date.now() - lastFetched < ttl;
};

/**
 * Unified hook for New Arrivals
 *
 * @param {Object} options
 * @param {"home"|"listing"} options.mode
 */
export default function useNewArrivalsProducts({ mode = "home" } = {}) {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.home.newArrivals);

  const { data, status, page, hasMore, lastFetched, ttl } = state;

  const loading = status === "loading" && data.length === 0;

  /* ---------------------------
     Initial fetch logic
  --------------------------- */
  useEffect(() => {
    // HOME MODE → cache based, page=1 only
    if (mode === "home") {
      if (loading) return;

      if (!isCacheValid(lastFetched, ttl)) {
        dispatch(fetchNewArrivals({ page: 1 }));
      }
      return;
    }

    // LISTING MODE → first load only if empty
    if (mode === "listing") {
      if (data.length === 0) {
        dispatch(fetchNewArrivals({ page: 1 }));
      }
    }
  }, [dispatch, mode, lastFetched]);

  /* ---------------------------
     Load more (listing only)
  --------------------------- */
  const loadMore = useCallback(() => {
    if (mode !== "listing") return;
    if (loading || !hasMore) return;

    dispatch(fetchNewArrivals({ page: page + 1 }));
  }, [dispatch, mode, loading, hasMore, page]);

  return {
    products: data,
    loading:
      mode === "listing"
        ? loading && data.length === 0 // only first load blocks UI
        : loading,
    error: status === "error",
    hasMore: mode === "listing" ? hasMore : false,
    loadMore: mode === "listing" ? loadMore : undefined,
  };
}
