"use client";
// Marks this hook as client-side only (uses Redux & browser timing)

import { useEffect } from "react";
// useEffect controls when the API call should run

import { useDispatch, useSelector } from "react-redux";
// Redux hooks for dispatching actions and reading store state

import { fetchFeaturedProducts } from "../store/homeReducer";
// Async Redux action to fetch featured products

/* ------------------------------------------------------------
   Cache validation helper
------------------------------------------------------------ */
const isCacheValid = (lastFetched, ttl) => {
  // If data was never fetched, cache is invalid
  if (!lastFetched) return false;

  // Cache is valid if still within TTL window
  return Date.now() - lastFetched < ttl;
};

export default function useFeaturedProducts() {
  // Initialize Redux dispatch
  const dispatch = useDispatch();

  // Select featured products slice from Redux store
  const featured = useSelector((state) => state.home.featured);

  /* ------------------------------------------------------------
     Fetch featured products only when cache expires
  ------------------------------------------------------------ */
  useEffect(() => {
    // Prevent duplicate API calls while loading
    if (featured.status === "loading") return;

    // Fetch data only if cache is missing or expired
    if (!isCacheValid(featured.lastFetched, featured.ttl)) {
      dispatch(fetchFeaturedProducts());
    }
  }, [dispatch, featured.status, featured.lastFetched, featured.ttl]);

  /* ------------------------------------------------------------
     Public API exposed by this hook
  ------------------------------------------------------------ */
  return {
    products: featured.data, // Featured products list
    loading: featured.status === "loading", // Loading state
    error: featured.status === "error", // Error state
  };
}
