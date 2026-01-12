"use client";

import { useMemo } from "react";
import { useSelector, shallowEqual } from "react-redux";

export function useCategoryFinders() {
  const categories = useSelector((s) => s.category.items, shallowEqual);

  return useMemo(() => {
    if (!categories?.length) {
      return {
        getCategoryBySlug: () => null,
        getSubcategoryBySlug: () => null,
        getChildBySlug: () => null,
        getSidebarTree: () => [],
      };
    }

    const catBySlug = new Map();
    const subBySlug = new Map();
    const childBySlug = new Map();

    categories.forEach((cat) => {
      catBySlug.set(cat.slug, cat);

      (cat.sub_categories || []).forEach((sub) => {
        subBySlug.set(`${cat.slug}::${sub.slug}`, sub);

        (sub.child_categories || []).forEach((child) => {
          childBySlug.set(`${cat.slug}::${sub.slug}::${child.slug}`, child);
        });
      });
    });

    return {
      getCategoryBySlug: (slug) => catBySlug.get(slug) || null,
      getSubcategoryBySlug: (c, s) => subBySlug.get(`${c}::${s}`) || null,
      getChildBySlug: (c, s, ch) =>
        childBySlug.get(`${c}::${s}::${ch}`) || null,
      getSidebarTree: (slug) =>
        (catBySlug.get(slug)?.sub_categories || []).map((s) => ({
          id: s.id,
          name: s.name,
          slug: s.slug,
          children: (s.child_categories || []).map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
          })),
        })),
    };
  }, [categories]);
}

export default useCategoryFinders;
