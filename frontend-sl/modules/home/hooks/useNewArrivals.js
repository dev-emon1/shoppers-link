"use client";
// Client-only hook (uses Redux hooks)

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNewArrivals } from "../store/homeReducer";

/* ------------------------------------------------------------
   Cache validation helper
------------------------------------------------------------ */
const isCacheValid = (lastFetched, ttl) => {
  if (!lastFetched) return false;
  return Date.now() - lastFetched < ttl;
};

export default function useNewArrivals() {
  // Initialize Redux dispatch
  const dispatch = useDispatch();

  // Select new arrivals slice from Redux store
  const state = useSelector((s) => s.home.newArrivals);

  /* ------------------------------------------------------------
     Fetch new arrivals only when cache expires
  ------------------------------------------------------------ */
  useEffect(() => {
    // Skip if already loading
    if (state.status === "loading") return;

    // Fetch data only if cache is invalid
    if (!isCacheValid(state.lastFetched, state.ttl)) {
      dispatch(fetchNewArrivals());
    }
  }, [dispatch, state.lastFetched]);

  return {
    products: state.data, // New arrivals list
    loading: state.status === "loading", // Loading state
    error: state.status === "error", // Error state
  };
}
