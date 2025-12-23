"use client";
import React from "react";
import { useSelector } from "react-redux";
import Card from "@/components/ui/Card";
import {
  selectProductsByChild,
  selectAllProducts,
} from "@/modules/product/store/selectors";

export default function RelatedProducts({ product }) {
  if (!product) return null;

  // Extract slugs safely from backend structure
  const catSlug = product.category?.slug ?? product.categorySlug ?? "";

  const subSlug = product.sub_category?.slug ?? product.subcategorySlug ?? "";

  const childSlug =
    product.child_category?.slug ?? product.childCategorySlug ?? "";

  // Fetch related using Redux selector
  const relatedByChild = useSelector((state) =>
    selectProductsByChild(state, childSlug)
  );

  // exclude self
  const related = Array.isArray(relatedByChild)
    ? relatedByChild.filter((p) => p.id !== product.id).slice(0, 8)
    : [];

  // fallback: top rated from store if no related found
  const allProducts = useSelector(selectAllProducts);
  const fallback =
    related.length > 0
      ? related
      : allProducts
          .filter((p) => p.isTopRated || p.featured?.is_featured)
          .slice(0, 8);

  if (!fallback.length) return null;

  return (
    <div className="container mt-16 mb-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-6 text-textPrimary">
        You may also like
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 lg:grid-cols-5 gap-4">
        {fallback.map((item) => (
          <div key={item.id}>
            <Card data={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
