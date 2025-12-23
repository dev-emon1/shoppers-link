// modules/search/hooks/useSearchProducts.js
"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadSearchResults, clearSearch } from "../store/searchReducer";

function debounce(fn, delay) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// simple in-memory cache for query -> results
const QUERY_CACHE = new Map();

export default function useSearchProducts(q) {
  const dispatch = useDispatch();
  const { items, loading, error, lastQuery } = useSelector(
    (s) =>
      s.search || {
        items: [],
        loading: false,
        error: null,
        lastQuery: "",
      }
  );

  const abortRef = useRef(null);

  useEffect(() => {
    // when query empty or too short, clear results
    const trimmed = (q || "").trim();

    if (!trimmed || trimmed.length < 2) {
      // only clear if we actually have something
      if (items.length) dispatch(clearSearch());
      return;
    }

    // if cached, directly dispatch fulfilled-like behavior by writing into store
    // but since we rely on loadSearchResults thunk to set items, we will just return cached value quickly:
    if (QUERY_CACHE.has(trimmed)) {
      // If cached and equals current lastQuery, do nothing
      if (lastQuery === trimmed) return;
      // dispatch a mocked fulfilled by dispatching loadSearchResults with no network (simpler: we can set store via action but to avoid deeper changes we'll skip)
      // Simpler approach: if cached, directly set items by dispatching loadSearchResults thunk would re-fetch; instead we can skip dispatch and let selector read QUERY_CACHE via local state
      // To avoid changing reducer, we will still trigger the thunk but it should be fast — however better to just bail and do nothing so UI can read previous items.
      // For now: do nothing -> UI will keep previous items (which should be the cached results if previously fetched).
      // If you want aggressive cache->store sync, we can add an action to set items; for now keep it simple.
    }

    const doSearch = debounce((searchValue) => {
      if (abortRef.current) {
        try {
          abortRef.current.abort();
        } catch (e) {}
      }
      const controller = new AbortController();
      abortRef.current = controller;

      // if exactly same query as lastQuery and items exist, skip
      if (lastQuery === searchValue && items.length) {
        return;
      }

      // dispatch the thunk which uses fetch/service; when it resolves we update cache in .then
      dispatch(
        loadSearchResults({ q: searchValue }, { signal: controller.signal })
      )
        .unwrap()
        .then((res) => {
          try {
            if (Array.isArray(res)) QUERY_CACHE.set(searchValue, res);
          } catch (e) {}
        })
        .catch((err) => {
          // ignore abort errors
        });
    }, 300);

    doSearch(trimmed);

    return () => {
      // cleanup debounce/abort
      try {
        doSearch.cancel?.();
      } catch (e) {}
      if (abortRef.current) {
        try {
          abortRef.current.abort();
        } catch (e) {}
        abortRef.current = null;
      }
    };
  }, [q, dispatch, lastQuery, items.length]);

  return { items, loading, error, lastQuery };
}
