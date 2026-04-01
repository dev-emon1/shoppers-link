import { useDispatch, useSelector } from "react-redux";
import { fetchShopByBrands } from "../store/homeReducer";
import { useEffect, useMemo } from "react";

export default function useShopByBrands({ mode = "home", limit = 10 } = {}) {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.home.shopByBrands);

  const { data, status, hasMore } = state;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchShopByBrands({ page: 1 }));
    }

    // background refresh after 30s
    const timer = setTimeout(() => {
      dispatch(fetchShopByBrands({ page: 1, force: true }));
    }, 30000);

    return () => clearTimeout(timer);
  }, [dispatch, status]);

  // ✅ Only show brands with valid link (your rule)
  const brandsWithLink = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter(
      (b) => typeof b.link === "string" && b.link.trim().length > 0,
    );
  }, [data]);

  const brands =
    mode === "home" ? brandsWithLink.slice(0, limit) : brandsWithLink;

  return {
    brands,
    loading: status === "loading" && data.length === 0,
    error: status === "error",
    showAll: mode === "home" && brandsWithLink.length > limit,
    hasMore,
  };
}
