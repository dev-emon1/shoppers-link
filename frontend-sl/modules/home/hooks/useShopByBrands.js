import { useDispatch, useSelector } from "react-redux";
import { fetchShopByBrands } from "../store/homeReducer";
import { useEffect, useMemo } from "react";

<<<<<<< HEAD
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
=======
export default function useShopByBrands({ mode = "home", limit = 15 } = {}) {
  const dispatch = useDispatch();
  const state = useSelector((s) => s.home.shopByBrands);

  const { data = [], status, hasMore, page, total = 0 } = state;

  /* ---------------------------------------
     INITIAL FETCH
  --------------------------------------- */
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchShopByBrands({ page: 1, perPage: 15 }));
    }
  }, [dispatch, status]);

  /* ---------------------------------------
     LOAD MORE FUNCTION 🔥
  --------------------------------------- */
  const loadMore = () => {
    if (!hasMore) return;

    dispatch(
      fetchShopByBrands({
        page: page + 1,
        perPage: 15,
      }),
    );
  };

  /* ---------------------------------------
     DATA
  --------------------------------------- */
  const brandsWithLink = useMemo(() => {
    if (!Array.isArray(data)) return [];

    return data.filter((b) => {
      return b && typeof b.id !== "undefined";
    });
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
  }, [data]);

  const brands =
    mode === "home" ? brandsWithLink.slice(0, limit) : brandsWithLink;

  return {
    brands,
    loading: status === "loading" && data.length === 0,
<<<<<<< HEAD
    error: status === "error",
    showAll: mode === "home" && brandsWithLink.length > limit,
    hasMore,
=======
    loadingMore: status === "loading" && data.length > 0, // 🔥 important
    error: status === "error",
    showAll: mode === "home" && total > limit,
    hasMore,
    loadMore, // 🔥 expose
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
  };
}
