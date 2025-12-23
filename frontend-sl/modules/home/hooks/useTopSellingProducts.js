"use client";
// Client-only hook for top-selling products

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTopSelling } from "../store/homeReducer";

/* ------------------------------------------------------------
   Cache validation helper
------------------------------------------------------------ */
const isCacheValid = (lastFetched, ttl) => {
  if (!lastFetched) return false;
  return Date.now() - lastFetched < ttl;
};

export default function useTopSellingProducts() {
  // Initialize Redux dispatch
  const dispatch = useDispatch();

  // Select top-selling products slice
  const state = useSelector((s) => s.home.topSelling);

  // NOTE: Remove this console.log in production
  // console.log(state);

  /* ------------------------------------------------------------
     Fetch top-selling products only when cache expires
  ------------------------------------------------------------ */
  useEffect(() => {
    // Skip if request is already in progress
    if (state.status === "loading") return;

    // Fetch data only if cache is invalid
    if (!isCacheValid(state.lastFetched, state.ttl)) {
      dispatch(fetchTopSelling());
    }
  }, [dispatch]);

  return {
    products: state.data, // Top-selling products list

    // Loading skeleton only when no cached data exists
    loading: state.status === "loading" && state.data.length === 0,

    error: state.status === "error", // Error state
  };
}
