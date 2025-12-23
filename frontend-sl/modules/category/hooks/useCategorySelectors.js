// modules/category/hooks/useCategorySelectors.js
"use client";

import { useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";

function normalize(raw = []) {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((cat) => {
      const subsRaw = cat.sub_categories || cat.subcategories || [];
      const subs = (Array.isArray(subsRaw) ? subsRaw : []).map((s) => {
        const childRaw = s.child_categories || s.children || [];
        const children = Array.isArray(childRaw) ? childRaw.slice() : [];
        children.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        return {
          ...s,
          children,
          child_categories: s.child_categories || children,
        };
      });
      subs.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
      return {
        ...cat,
        subcategories: subs,
        sub_categories: cat.sub_categories || subs,
      };
    })
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
}

export function useCategorySelectors() {
  const raw = useSelector(
    (s) => (s?.category?.items ? s.category.items : []),
    shallowEqual
  );
  const categories = useMemo(() => normalize(raw), [raw]);
  return { categories };
}
