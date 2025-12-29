// modules/search/hooks/useSearchProducts.js
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loadSearchResults, setSearchQuery } from "../store/searchReducer";

export default function useSearchProducts({
  query,
  categoryId = null,
  limit = null,
  debounce = 300,
}) {
  const dispatch = useDispatch();
  const abortRef = useRef(null);
  const debounceRef = useRef(null);

  const { items, total, status } = useSelector((state) => state.search);

  useEffect(() => {
    if (!query) return;

    dispatch(setSearchQuery(query));

    // debounce
    clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      // abort previous request
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
  };
}
