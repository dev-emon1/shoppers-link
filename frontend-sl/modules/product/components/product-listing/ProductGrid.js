"use client";

import React from "react";
import Card from "@/components/ui/Card";

function ProductGrid({
  products = [],
  baseHref = "",
  hasMore = false,
  onLoadMore,
  loading = false,
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
          const catSlug = p.category?.slug ?? "";
          const subSlug = p.sub_category?.slug ?? "";
          const childSlug = p.child_category?.slug ?? "";

          const href = baseHref
            ? `${baseHref}/${p.slug}`
            : `/${catSlug}/${subSlug}/${childSlug}/${p.slug}`;

          return (
            <div key={p.id}>
              <Card data={p} href={href} showSoldCount />
            </div>
          );
        })}
      </div>

      {hasMore && typeof onLoadMore === "function" && (
        <div className="flex justify-center mt-12">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="bg-main text-white px-8 py-2.5 rounded-lg hover:bg-main/90 disabled:opacity-60 transition-all"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default React.memo(ProductGrid);
