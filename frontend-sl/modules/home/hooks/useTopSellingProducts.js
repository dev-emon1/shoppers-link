"use client";

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopSelling } from "../store/homeReducer";

const isCacheValid = (lastFetched, ttl) => {
  if (!lastFetched) return false;
  return Date.now() - lastFetched < ttl;
};

/**
 * Unified hook for Top Selling Products
 *
 * @param {Object} options
 * @param {"home"|"listing"} options.mode
 */
export default function useTopSellingProductsUnified({ mode = "home" } = {}) {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.home.topSelling);

  const { data, status, page, hasMore, lastFetched, ttl } = state;

  const loading = status === "loading";

  /* ---------------------------
     Initial fetch logic
  --------------------------- */
  useEffect(() => {
    // HOME MODE → cache + page 1
    if (mode === "home") {
      if (loading) return;

      if (!isCacheValid(lastFetched, ttl)) {
        dispatch(fetchTopSelling({ page: 1 }));
      }
      return;
    }

    // LISTING MODE → load first page once
    if (mode === "listing") {
      if (data.length === 0) {
        dispatch(fetchTopSelling({ page: 1 }));
      }
    }
  }, [dispatch, mode, lastFetched]);

  /* ---------------------------
     Load more (listing only)
  --------------------------- */
  const loadMore = useCallback(() => {
    if (mode !== "listing") return;
    if (loading || !hasMore) return;

    dispatch(fetchTopSelling({ page: page + 1 }));
  }, [dispatch, mode, loading, hasMore, page]);

  return {
    products: data,
    loading: mode === "listing" ? loading && data.length === 0 : loading,
    error: status === "error",
    hasMore: mode === "listing" ? hasMore : false,
    loadMore: mode === "listing" ? loadMore : undefined,
  };
}
