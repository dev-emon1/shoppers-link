"use client";

import React from "react";
import Card3 from "@/components/ui/Card3";

const MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_BASE || "http://localhost:8000";

/* ------------------------------------------------------------
   Helpers
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
   - products      : array (already filtered + paginated)
   - baseHref?     : optional base url
   - hasMore?      : boolean
   - onLoadMore?   : fn
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
    <div className="w-full">
      {/* ================= GRID ================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 md:gap-8">
        {products.map((p) => {
          /* ---------------- Product URL ---------------- */
          const catSlug = p.category?.slug ?? p.categorySlug ?? "";
          const subSlug = p.sub_category?.slug ?? p.subcategorySlug ?? "";
          const childSlug = p.child_category?.slug ?? p.childCategorySlug ?? "";

          const href = baseHref
            ? `${baseHref}/${p.slug}`
            : `/${catSlug}/${subSlug}/${childSlug}/${p.slug}`;

          /* ---------------- Image ---------------- */
          const imageSrc = (() => {
            if (Array.isArray(p.images) && p.images.length > 0) {
              const first = p.images[0];
              if (first?.image_path)
                return buildImageUrl(`storage/${first.image_path}`);
              if (typeof first === "string") return buildImageUrl(first);
              if (first.url) return buildImageUrl(first.url);
              if (first.src) return buildImageUrl(first.src);
            }

            if (p.primary_image) {
              return String(p.primary_image).startsWith("http")
                ? p.primary_image
                : buildImageUrl(p.primary_image);
            }

            if (p.image) {
              return String(p.image).startsWith("http")
                ? p.image
                : buildImageUrl(p.image);
            }

            return "/images/product-placeholder.jpg";
          })();

          /* ---------------- Price ---------------- */
          const numericPrice = (() => {
            try {
              if (Array.isArray(p.variants) && p.variants.length > 0) {
                const v = p.variants[0];
                const price = v?.price ?? v?.base_price;
                if (!Number.isNaN(Number(price))) return Number(price);
              }

              if (!Number.isNaN(Number(p.price))) return Number(p.price);
              if (!Number.isNaN(Number(p.base_price)))
                return Number(p.base_price);
            } catch {}
            return null;
          })();

          const vendorName = p.vendor?.shop_name ?? p.vendor?.name ?? null;

          return (
            <div
              key={p.id}
              className="group block border border-border rounded-xl bg-white overflow-hidden hover:shadow-lg transition-all"
            >
              <Card3
                product={p}
                imageSrc={imageSrc}
                isNew={!!(p.is_new || p.isNew || p.featured?.is_featured)}
                discount={p.discount ?? 0}
                name={p.name}
                vendorId={p.vendor?.id}
                vendorName={vendorName}
                rating={p.rating ?? 0}
                price={numericPrice}
                oldPrice={
                  p.old_price !== undefined && p.old_price !== null
                    ? Number(p.old_price)
                    : null
                }
                category={p.category?.name ?? ""}
                href={href}
              />
            </div>
          );
        })}
      </div>

      {/* ================= LOAD MORE ================= */}
      {hasMore && typeof onLoadMore === "function" && (
        <div className="flex justify-center mt-12">
          <button
            onClick={onLoadMore}
            className="
              bg-main text-white px-8 py-2.5 rounded-lg
              hover:bg-main/90 transition-all
            "
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------
   Memoized export
------------------------------------------------------------ */
export default React.memo(ProductGrid);
