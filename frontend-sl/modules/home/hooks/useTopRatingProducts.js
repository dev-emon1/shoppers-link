"use client";
// Client-only hook for top-rated products

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopRatingProducts } from "../store/homeReducer";

/* ------------------------------------------------------------
   Cache validation helper
------------------------------------------------------------ */
const isCacheValid = (lastFetched, ttl) => {
  if (!lastFetched) return false;
  return Date.now() - lastFetched < ttl;
};

export default function useTopRatingProducts() {
  // Initialize Redux dispatch
  const dispatch = useDispatch();

  // Select top-rating products slice
  const state = useSelector((s) => s.home.topRating);

  /* ------------------------------------------------------------
     Fetch top-rating products only when cache expires
  ------------------------------------------------------------ */
  useEffect(() => {
    // Avoid duplicate requests while loading
    if (state.status === "loading") return;

    // Fetch only if cache is invalid
    if (!isCacheValid(state.lastFetched, state.ttl)) {
      dispatch(fetchTopRatingProducts());
    }
  }, [dispatch]);

  return {
    products: state.data, // Top-rated products list

    // Show loading skeleton only when no cached data exists
    loading: state.status === "loading" && state.data.length === 0,

    error: state.status === "error", // Error state
  };
}
