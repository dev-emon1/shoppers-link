"use client";

import { useMemo, useState } from "react";

/* ======================================================
   Pure filtering logic
====================================================== */

function applyFilters(products = [], filters = {}) {
  return products.filter((p) => {
    if (filters.availability === "in" && p.stock <= 0) return false;

    if (filters.price?.length === 2) {
      if (p.price < filters.price[0] || p.price > filters.price[1])
        return false;
    }

    if (filters.brands?.length && !filters.brands.includes(p.brand))
      return false;

    if (filters.vendors?.length && !filters.vendors.includes(p.vendor_id))
      return false;

    if (filters.ratings?.length) {
      const ok = filters.ratings.some((r) => p.rating >= r);
      if (!ok) return false;
    }

    if (filters.discounts?.length) {
      const ok = filters.discounts.some((d) => p.discount_percent >= d);
      if (!ok) return false;
    }

    return true;
  });
}

/* ======================================================
   useProductFilters (PURE)
====================================================== */

export default function useProductFilters({
  products = [],
  initialFilters = {},
  onFiltersChange = () => {},
}) {
  const [selected, setSelected] = useState(initialFilters);

  const updateFilters = (next) => {
    setSelected(next);
    onFiltersChange(next);
  };

  const clearFilters = () => {
    setSelected({});
    onFiltersChange({});
  };

  const activeCount = useMemo(() => {
    let count = 0;
    if (selected.brands?.length) count += selected.brands.length;
    if (selected.ratings?.length) count += selected.ratings.length;
    if (selected.discounts?.length) count += selected.discounts.length;
    if (selected.vendors?.length) count += selected.vendors.length;
    if (selected.availability) count += 1;
    if (selected.price?.length === 2) count += 1;
    return count;
  }, [selected]);

  const filteredProducts = useMemo(
    () => applyFilters(products, selected),
    [products, selected]
  );

  return {
    selected,
    setSelected: updateFilters,
    filteredProducts,
    clearFilters,
    activeCount,
  };
}
