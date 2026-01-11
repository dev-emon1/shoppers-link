"use client";

import React from "react";
import Card from "@/components/ui/Card";

const MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_BASE || "http://localhost:8000";

/* ------------------------------------------------------------
   Helpers (UNCHANGED)
------------------------------------------------------------ */
function buildImageUrl(path) {
  if (!path) return "";
  try {
    const base = MEDIA_BASE.endsWith("/") ? MEDIA_BASE : MEDIA_BASE + "/";
    return new URL(path, base).toString();
  } catch {
    return path;
  }
}

/* ------------------------------------------------------------
   ProductGrid (UI only)
------------------------------------------------------------ */
function ProductGrid({
  products = [],
  baseHref = "",
  hasMore = false,
  onLoadMore,
}) {
  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        No products found.
      </div>
    );
  }

  return (
    <div className="w-full pb-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 md:gap-8">
        {products.map((p) => {
          const catSlug = p.category?.slug ?? p.categorySlug ?? "";
          const subSlug = p.sub_category?.slug ?? p.subcategorySlug ?? "";
          const childSlug = p.child_category?.slug ?? p.childCategorySlug ?? "";

          const href = baseHref
            ? `${baseHref}/${p.slug}`
            : `/${catSlug}/${subSlug}/${childSlug}/${p.slug}`;

          return (
            <div key={p.id}>
              {/* ONLY CARD */}
              <Card data={p} href={href} showSoldCount={true} />
            </div>
          );
        })}
      </div>

      {hasMore && typeof onLoadMore === "function" && (
        <div className="flex justify-center mt-12">
          <button
            onClick={onLoadMore}
            className="bg-main text-white px-8 py-2.5 rounded-lg hover:bg-main/90 transition-all"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

export default React.memo(ProductGrid);
