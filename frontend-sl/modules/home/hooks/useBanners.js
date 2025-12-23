"use client";
// Marks this hook as client-side only (uses Redux hooks and browser timing)

import { useEffect } from "react";
// useEffect is used to control when banners are fetched

import { useDispatch, useSelector } from "react-redux";
// Redux hooks for dispatching actions and selecting store state

import { fetchBanners } from "../store/homeReducer";
// Async Redux action to fetch banner data from API

/* ------------------------------------------------------------
   Cache validation helper
   Checks whether cached data is still valid based on TTL
------------------------------------------------------------ */
const isCacheValid = (lastFetched, ttl) => {
  // If data was never fetched, cache is invalid
  if (!lastFetched) return false;

  // Cache is valid if current time is within TTL window
  return Date.now() - lastFetched < ttl;
};

export default function useBanners() {
  // Initialize Redux dispatch
  const dispatch = useDispatch();

  // Select banner state from Redux store
  const state = useSelector((s) => s.home.banners);

  /* ------------------------------------------------------------
     Fetch banners only when cache is expired
  ------------------------------------------------------------ */
  useEffect(() => {
    // Prevent duplicate requests while already loading
    if (state.status === "loading") return;

    // Fetch banners if cache is missing or expired
    if (!isCacheValid(state.lastFetched, state.ttl)) {
      dispatch(fetchBanners());
    }
  }, [dispatch, state.lastFetched]);
  // Dependency ensures effect re-runs when cache timestamp changes

  /* ------------------------------------------------------------
     Public API returned by this hook
  ------------------------------------------------------------ */
  return {
    banners: state.data, // Banner list
    loading: state.status === "loading", // Loading state
    error: state.status === "error", // Error state
  };
}
