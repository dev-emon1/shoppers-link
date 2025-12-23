// modules/category/hooks/useCategoryFinders.js
"use client";

import { useMemo } from "react";
import { useSelector } from "react-redux";

/**
 * useCategoryFinders
 * - Accepts raw backend shape (no normalization)
 * - Builds maps for O(1) lookups by slug combinations
 * - Provides getCategoryBySlug, getSubcategoryBySlug, getChildBySlug, getSidebarTree
 *
 * Key format used internally:
 *  - sub key:    `${catSlug}::${subSlug}`
 *  - child key:  `${catSlug}::${subSlug}::${childSlug}`
 */
export function useCategoryFinders() {
  const categories = useSelector((s) =>
    s?.category?.items ? s.category.items : []
  );

  return useMemo(() => {
    const catBySlug = new Map();
    const subBySlug = new Map();
    const childBySlug = new Map();

    if (!Array.isArray(categories) || categories.length === 0) {
      return {
        getCategoryBySlug: () => null,
        getSubcategoryBySlug: () => null,
        getChildBySlug: () => null,
        getSidebarTree: () => [],
        getProductBySlug: () => null,
      };
    }

    categories.forEach((cat) => {
      const cslug = String(cat?.slug ?? "").trim();
      if (!cslug) return;
      catBySlug.set(cslug, cat);

      const subs = Array.isArray(cat?.sub_categories)
        ? cat.sub_categories
        : Array.isArray(cat?.subcategories)
        ? cat.subcategories
        : [];

      subs.forEach((sub) => {
        const sslug = String(sub?.slug ?? "").trim();
        if (!sslug) return;
        subBySlug.set(`${cslug}::${sslug}`, { ...sub, _parent: cat });

        const childs = Array.isArray(sub?.child_categories)
          ? sub.child_categories
          : Array.isArray(sub?.children)
          ? sub.children
          : [];

        childs.forEach((child) => {
          const chslug = String(child?.slug ?? "").trim();
          if (!chslug) return;
          childBySlug.set(`${cslug}::${sslug}::${chslug}`, {
            ...child,
            _parent: sub,
            _category: cat,
          });
        });
      });
    });

    const getCategoryBySlug = (slug) => {
      if (!slug) return null;
      return catBySlug.get(String(slug)) || null;
    };

    const getSubcategoryBySlug = (catSlug, subSlug) => {
      if (!catSlug || !subSlug) return null;
      return subBySlug.get(`${String(catSlug)}::${String(subSlug)}`) || null;
    };

    const getChildBySlug = (catSlug, subSlug, childSlug) => {
      if (!catSlug || !subSlug || !childSlug) return null;
      return (
        childBySlug.get(
          `${String(catSlug)}::${String(subSlug)}::${String(childSlug)}`
        ) || null
      );
    };

    const getSidebarTree = (catSlug) => {
      const cat = getCategoryBySlug(catSlug);
      if (!cat) return [];
      const subs = Array.isArray(cat?.sub_categories)
        ? cat.sub_categories
        : Array.isArray(cat?.subcategories)
        ? cat.subcategories
        : [];
      return subs.map((s) => ({
        id: s.id,
        name: s.name,
        slug: s.slug,
        children: (Array.isArray(s?.child_categories)
          ? s.child_categories
          : Array.isArray(s?.children)
          ? s.children
          : []
        ).map((ch) => ({
          id: ch.id,
          name: ch.name,
          slug: ch.slug,
        })),
      }));
    };

    // product finder stub (keeps API stable)
    const getProductBySlug = (productSlug) => {
      // not implemented in this hook
      return null;
    };

    return {
      getCategoryBySlug,
      getSubcategoryBySlug,
      getChildBySlug,
      getSidebarTree,
      getProductBySlug,
    };
  }, [categories]);
}

export default useCategoryFinders;
