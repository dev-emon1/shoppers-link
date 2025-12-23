// modules/search/components/SearchProductGrid.js
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Card3 from "@/components/ui/Card3";

const MEDIA_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_MEDIA_BASE) ||
  "http://localhost:8000";

function buildImageUrl(path) {
  if (!path) return "";
  try {
    const base = MEDIA_BASE.endsWith("/") ? MEDIA_BASE : MEDIA_BASE + "/";
    return new URL(String(path), base).toString();
  } catch (e) {
    return path;
  }
}

/** highlight matched query in product name **/
function HighlightMatch({ text = "", q = "" }) {
  if (!q) return <>{text}</>;
  const safeQ = String(q).trim();
  if (!safeQ) return <>{text}</>;
  const parts = String(text).split(
    new RegExp(`(${escapeRegExp(safeQ)})`, "ig")
  );
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === safeQ.toLowerCase() ? (
          <mark
            key={i}
            className="bg-yellow-100 text-textPrimary px-0.5 rounded"
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * SearchProductGrid
 * Props:
 *  - products: array
 *  - baseHref: optional
 *  - initialVisible: default 12
 *  - loadStep: default 8
 *  - autoLoad: boolean -> enable infinite scroll (default true)
 *  - query: search term (for highlighting)
 */
export default function SearchProductGrid({
  products = [],
  baseHref = "",
  initialVisible = 12,
  loadStep = 8,
  autoLoad = true,
  query = "",
}) {
  const router = useRouter();
  const [visibleCount, setVisibleCount] = useState(initialVisible);
  const sentinelRef = useRef(null);
  const prefetchLinksRef = useRef(new Map()); // href -> linkElement

  useEffect(() => {
    // reset visibleCount when products or query changes
    setVisibleCount(initialVisible);
  }, [products, query, initialVisible]);

  // infinite scroll observer
  useEffect(() => {
    if (!autoLoad) return;
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleCount((prev) => {
              if (prev >= (products?.length || 0)) return prev;
              return prev + loadStep;
            });
          }
        });
      },
      {
        root: null,
        rootMargin: "200px",
        threshold: 0.1,
      }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [sentinelRef.current, products, loadStep, autoLoad]);

  // cleanup prefetch link tags on unmount
  useEffect(() => {
    return () => {
      prefetchLinksRef.current.forEach((link) => {
        try {
          link.remove();
        } catch (e) {}
      });
      prefetchLinksRef.current.clear();
    };
  }, []);

  const handlePrefetch = useCallback((href) => {
    if (!href) return;
    if (prefetchLinksRef.current.has(href)) return;
    try {
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = href;
      link.as = "document";
      document.head.appendChild(link);
      prefetchLinksRef.current.set(href, link);
      // remove after some time to avoid memory bloat
      setTimeout(() => {
        // keep short-lived, but don't remove immediately as browser may use it
        if (prefetchLinksRef.current.has(href)) {
          // optional: keep it; for now we keep it
        }
      }, 30_000);
    } catch (e) {
      // ignore
    }
  }, []);

  const handleMouseEnter = useCallback(
    (href) => {
      // debounce-ish: create prefetch after small delay to avoid too many tags on quick moves
      const t = setTimeout(() => handlePrefetch(href), 120);
      return () => clearTimeout(t);
    },
    [handlePrefetch]
  );

  const visibleProducts = Array.isArray(products)
    ? products.slice(0, visibleCount)
    : [];

  if (!Array.isArray(products) || products.length === 0) {
    return (
      <div className="text-center py-20 text-textSecondary">
        No products found.
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-textSecondary">
          Showing{" "}
          <span className="font-semibold text-textPrimary">
            {Math.min(visibleCount, products.length)}
          </span>{" "}
          of{" "}
          <span className="font-semibold text-textPrimary">
            {products.length}
          </span>{" "}
          products
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5 md:gap-8">
        {visibleProducts.map((p) => {
          const catSlug = p.category?.slug ?? p.categorySlug ?? "";
          const subSlug = p.sub_category?.slug ?? p.subcategorySlug ?? "";
          const childSlug = p.child_category?.slug ?? p.childCategorySlug ?? "";
          const href = baseHref
            ? `${baseHref.replace(/\/$/, "")}/${p.slug}`
            : `/${[catSlug, subSlug, childSlug, p.slug]
                .filter(Boolean)
                .join("/")}`;

          const imageSrc = (() => {
            if (Array.isArray(p.images) && p.images.length > 0) {
              const first = p.images[0];
              if (first && typeof first === "object" && first.image_path) {
                return buildImageUrl(`storage/${first.image_path}`);
              }
              if (typeof first === "string") {
                return buildImageUrl(first);
              }
              if (first?.url) return buildImageUrl(first.url);
              if (first?.src) return buildImageUrl(first.src);
            }
            if (p.primary_image) {
              if (String(p.primary_image).startsWith("http"))
                return p.primary_image;
              return buildImageUrl(p.primary_image);
            }
            if (p.image) {
              if (String(p.image).startsWith("http")) return p.image;
              return buildImageUrl(p.image);
            }
            if (p.image_url) {
              if (String(p.image_url).startsWith("http")) return p.image_url;
              return buildImageUrl(p.image_url);
            }
            return "/images/product-placeholder.jpg";
          })();

          // price resolution
          const numericPrice = (() => {
            try {
              if (Array.isArray(p.variants) && p.variants.length > 0) {
                const v = p.variants[0];
                const vprice = v?.price ?? v?.base_price ?? null;
                if (
                  vprice !== null &&
                  vprice !== undefined &&
                  !Number.isNaN(Number(vprice))
                )
                  return Number(vprice);
              }
              if (
                p.price !== undefined &&
                p.price !== null &&
                !Number.isNaN(Number(p.price))
              )
                return Number(p.price);
              if (
                p.base_price !== undefined &&
                p.base_price !== null &&
                !Number.isNaN(Number(p.base_price))
              )
                return Number(p.base_price);
            } catch (e) {}
            return null;
          })();

          const vendorName = p.vendor?.shop_name ?? p.vendor?.name ?? null;
          const slugForProps = p.slug ?? p.id ?? p._id ?? "";

          return (
            <div
              key={p.id ?? p._id ?? slugForProps}
              className="group block border border-border rounded-xl bg-white overflow-hidden hover:shadow-lg transition-all"
              // accessibility: focusable container
              role="article"
              tabIndex={0}
              aria-label={p.name ?? "Product"}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  router.push(href);
                }
              }}
              onMouseEnter={() => handleMouseEnter(href)}
              onFocus={() => handlePrefetch(href)}
            >
              <Link
                href={href}
                onClick={(ev) => {
                  /* normal link click will navigate; but allow Card3's Link to handle it too */
                }}
              >
                <Card3
                  product={p}
                  imageSrc={imageSrc}
                  isNew={!!(p.is_new || p.isNew || p.featured?.is_featured)}
                  discount={p.discount ?? 0}
                  name={p.name ?? p.title ?? "Product Name"}
                  vendorId={p.vendor?.id}
                  vendorName={vendorName}
                  rating={p.rating ?? 0}
                  price={numericPrice}
                  oldPrice={
                    p.old_price !== undefined && p.old_price !== null
                      ? Number(p.old_price)
                      : null
                  }
                  category={p.category?.name ?? p.category ?? ""}
                  href={href}
                />
              </Link>
              {/* overlay small badge showing match count or highlight — optional */}
              <div className="p-2">
                <h3 className="text-sm font-medium text-textPrimary line-clamp-2">
                  <HighlightMatch text={p.name ?? p.title ?? ""} q={query} />
                </h3>
              </div>
            </div>
          );
        })}
      </div>

      {/* sentinel for infinite scroll + load more fallback */}
      <div ref={sentinelRef} />

      {visibleCount < products.length && (
        <div className="flex justify-center mt-10">
          <button
            onClick={() => setVisibleCount((prev) => prev + loadStep)}
            className="bg-main text-white px-6 py-2 rounded-lg hover:bg-main/90 transition-all"
            aria-label="Load more products"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
}
