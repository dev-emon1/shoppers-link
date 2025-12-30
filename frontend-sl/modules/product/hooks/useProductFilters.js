"use client";

import { useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/* ======================================================
   URL <-> Filter helpers
====================================================== */

function parseFiltersFromSearchParams(sp) {
  return {
    brands: (sp.get("brands") || "").split(",").filter(Boolean),
    ratings: (sp.get("ratings") || "").split(",").map(Number).filter(Boolean),
    discounts: (sp.get("discounts") || "")
      .split(",")
      .map(Number)
      .filter(Boolean),
    vendors: (sp.get("vendors") || "").split(",").map(Number).filter(Boolean),
    availability: sp.get("in_stock") || null,
    price:
      (sp.get("price") || "")
        .split("-")
        .map(Number)
        .filter((n) => !isNaN(n)).length === 2
        ? (sp.get("price") || "").split("-").map(Number)
        : [],
  };
}

function filtersToSearchParams(filters) {
  const q = new URLSearchParams();

  if (filters.brands?.length) q.set("brands", filters.brands.join(","));
  if (filters.ratings?.length) q.set("ratings", filters.ratings.join(","));
  if (filters.discounts?.length)
    q.set("discounts", filters.discounts.join(","));
  if (filters.vendors?.length) q.set("vendors", filters.vendors.join(","));
  if (filters.availability) q.set("in_stock", filters.availability);
  if (filters.price?.length === 2)
    q.set("price", `${filters.price[0]}-${filters.price[1]}`);

  return q;
}

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
   useProductFilters (FINAL)
====================================================== */

export default function useProductFilters(products = []) {
  const router = useRouter();
  const sp = useSearchParams();

  /* ---------- state ---------- */
  const [selected, setSelected] = useState(() =>
    parseFiltersFromSearchParams(sp)
  );

  /* ---------- URL -> state ---------- */
  useEffect(() => {
    setSelected(parseFiltersFromSearchParams(sp));
  }, [sp.toString()]);

  /* ---------- state -> URL ---------- */
  const updateFilters = (next) => {
    setSelected(next);
    const q = filtersToSearchParams(next);
    router.replace(`?${q.toString()}`, { scroll: false });
  };

  /* ---------- clear all ---------- */
  const clearFilters = () => {
    setSelected({});
    router.replace(`?`, { scroll: false });
  };

  /* ---------- active filter count ---------- */
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

  /* ---------- filtered products ---------- */
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
