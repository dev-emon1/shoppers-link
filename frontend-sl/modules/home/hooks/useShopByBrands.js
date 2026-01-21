import { useDispatch, useSelector } from "react-redux";
import { fetchShopByBrands } from "../store/homeReducer";
import { useEffect, useMemo } from "react";

export default function useShopByBrands({ mode = "home", limit = 10 } = {}) {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.home.shopByBrands);

  const { data, status, page, hasMore, lastFetched, ttl } = state;

  useEffect(() => {
    if (status === "loading") return;

    if (!lastFetched) {
      dispatch(fetchShopByBrands({ page: 1 }));
    }
  }, [dispatch]);

  // filter brands with valid link
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
