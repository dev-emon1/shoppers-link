"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadAllCategories } from "../store/categoryReducer";

const isCacheValid = (lastFetched, ttl) => {
  if (!lastFetched) return false;
  return Date.now() - lastFetched < ttl;
};

export default function useCategories() {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.category);

  useEffect(() => {
    if (state.status === "loading") return;

    if (!isCacheValid(state.lastFetched, state.ttl)) {
      dispatch(loadAllCategories());
    }
  }, [dispatch, state.lastFetched]);

  return {
    categories: state.items,
    loading: state.status === "loading" && state.items.length === 0,
    error: state.status === "error",
  };
}
