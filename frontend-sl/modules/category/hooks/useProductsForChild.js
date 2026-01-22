// modules/category/hooks/useProductsForChild.redux.js
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "@/modules/product/store/productReducer";
import { selectProductsByChild } from "@/modules/product/store/selectors";

/**
 * useProductsForChildRedux({ catSlug, subSlug, childSlug })
 * - Simple: ensures products are fetched once, then selects by childSlug
 * - Accepts childSlug exactly as used in your MegaMenu (no slugify)
 */
export default function useProductsForChildRedux({
  catSlug,
  subSlug,
  childSlug,
} = {}) {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.products.loading);
  const error = useSelector((state) => state.products.error);
  const lastFetched = useSelector((state) => state.products.lastFetched);

  // ensure products loaded at least once (simple approach)
  useEffect(() => {
    if (!lastFetched) {
      // Fetch first page with small per_page if you want, or fetch all (simple)
      // For now, fetch per_page=100 (you can change) or send no params to get full list
      dispatch(fetchProducts({ page: 1, per_page: 100 })); // adjust per_page as you prefer for now
    }
  }, [dispatch, lastFetched]);

  // products filtered by child
  const products = useSelector((state) =>
    selectProductsByChild(state, childSlug),
  );

  // derive simple filters
  const deriveFilters = (list = products) => {
    const brands = new Set();
    const ratings = new Set();
    let min = Infinity,
      max = 0;
    (list || []).forEach((p) => {
      if (p.brand) brands.add(p.brand);
      if (p.rating) ratings.add(Math.floor(Number(p.rating || 0)));
      const price = Number(p.price || 0);
      if (!Number.isNaN(price)) {
        if (price < min) min = price;
        if (price > max) max = price;
      }
    });
    return {
      brands: Array.from(brands).sort(),
      ratings: Array.from(ratings).sort((a, b) => b - a),
      priceRange: isFinite(min) ? [min, max] : [0, 0],
    };
  };

  const applyFilters = (
    list = products,
    selected = { brands: [], ratings: [], price: [] },
  ) => {
    if (!Array.isArray(list)) return [];
    return list.filter((p) => {
      if (selected.brands && selected.brands.length) {
        if (!p.brand || !selected.brands.includes(p.brand)) return false;
      }
      if (selected.ratings && selected.ratings.length) {
        const r = Math.floor(Number(p.rating || 0));
        if (!selected.ratings.includes(r)) return false;
      }
      if (selected.price && selected.price.length === 2) {
        const [minP, maxP] = selected.price;
        const price = Number(p.price || 0);
        if (price < minP || price > maxP) return false;
      }
      return true;
    });
  };

  const refresh = (params = {}) => {
    dispatch(fetchProducts(params));
  };

  // memoize deriveFilters result for basic perf
  const filters = useMemo(() => deriveFilters(products), [products]);

  return {
    products: products || [],
    loading,
    error,
    deriveFilters: () => filters,
    applyFilters,
    refresh,
  };
}
