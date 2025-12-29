// modules/search/hooks/useSearchProducts.js
"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loadSearchResults,
  setSearchQuery,
  setSearchCategory,
} from "../store/searchReducer";

/**
 * useSearchProducts
 *
 * Handles:
 * - search only
 * - category only
 * - search + category
 * - debounce
 * - abort previous requests
 */
export default function useSearchProducts({
  query = "",
  categoryId = null,
  limit = null,
  debounce = 300,
}) {
  const dispatch = useDispatch();

  const abortRef = useRef(null);
  const debounceRef = useRef(null);

  const { items, total, status } = useSelector((state) => state.search);

  useEffect(() => {
    /**
     * ❗ IMPORTANT RULE
     * Only block when BOTH query & categoryId are missing
     */
    if (!query && !categoryId) return;

    // keep redux state in sync (optional but clean)
    dispatch(setSearchQuery(query));
    dispatch(setSearchCategory(categoryId));

    // clear previous debounce timer
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      // abort previous request if exists
      abortRef.current?.abort();
      abortRef.current = new AbortController();

      dispatch(
        loadSearchResults({
          q: query,
          categoryId,
          limit,
          signal: abortRef.current.signal,
        })
      );
    }, debounce);

    return () => {
      clearTimeout(debounceRef.current);
      abortRef.current?.abort();
    };
  }, [query, categoryId, limit, debounce, dispatch]);

  return {
    items,
    total,
    loading: status === "loading",
    isEmpty: status === "success" && items.length === 0,
    status, // optional (debug / UI states)
  };
}
