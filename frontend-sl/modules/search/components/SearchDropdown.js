// modules/search/components/SearchDropdown.jsx
"use client";

import React, { useRef, useEffect } from "react";
import { X } from "lucide-react";
import useSearchProducts from "../hooks/useSearchProducts";
import Card3 from "@/components/ui/Card3";

const MEDIA_BASE =
  (typeof process !== "undefined" && process.env.NEXT_PUBLIC_MEDIA_BASE) ||
  "http://localhost:8000";

function buildImageUrl(path) {
  if (!path) return "";
  try {
    const base = MEDIA_BASE.endsWith("/") ? MEDIA_BASE : MEDIA_BASE + "/";
    return new URL(path, base).toString();
  } catch (e) {
    return path;
  }
}

function resolveImageSrc(p) {
  if (!p) return "/images/product-placeholder.jpg";

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
    if (String(p.primary_image).startsWith("http")) return p.primary_image;
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
}

function buildHrefFromProduct(p, baseHref = "") {
  if (!p) return "#";

  if (baseHref && typeof baseHref === "string" && baseHref.trim()) {
    const trimmedBase = baseHref.replace(/\/$/, "");
    const prodSlug = p.slug ?? p.product_slug ?? p.id ?? p._id ?? "";
    return prodSlug ? `${trimmedBase}/${prodSlug}` : trimmedBase;
  }

  const catSlug = p.category?.slug ?? p.categorySlug ?? p.category_slug ?? "";
  const subSlug =
    p.sub_category?.slug ?? p.subcategorySlug ?? p.sub_category_slug ?? "";
  const childSlug =
    p.child_category?.slug ??
    p.childCategorySlug ??
    p.child_category_slug ??
    "";
  const prodSlug = p.slug ?? p.product_slug ?? p.url_slug ?? p.handle ?? "";

  if (prodSlug && catSlug) {
    const parts = [catSlug, subSlug, childSlug, prodSlug].filter(Boolean);
    return "/" + parts.map((s) => s.replace(/^\/|\/$/g, "")).join("/");
  }

  if (p.full_slug) return `/${String(p.full_slug).replace(/^\//, "")}`;
  if (p.url_path) return `/${String(p.url_path).replace(/^\//, "")}`;

  if (p.slug) return `/${p.slug}`;
  if (p.id || p._id) return `/product/${p.id ?? p._id}`;

  return "#";
}

export default function SearchDropdown({
  isOpen = false,
  onClose = () => {},
  query = "",
  baseHref = "",
}) {
  const { items: products = [], loading, error } = useSearchProducts(query);

  // also close on Escape key (nice to have)
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="absolute top-full left-0 w-full bg-bgSurface shadow-2xl border-t border-border z-50 animate-fadeIn">
        <div className="container py-6 md:py-8">
          <div className="flex flex-col md:flex-row gap-6">
            <aside className="flex-1 min-w-[220px]">
              <div className="mb-2">
                <h3 className="text-lg font-semibold text-textPrimary">
                  Search
                </h3>
                <p className="text-xs text-textSecondary mt-1">
                  Results for <strong>{query || "—"}</strong>
                </p>
              </div>
              <div className="mt-4 text-xs text-textSecondary">
                <p>
                  Tip: try brand, model, or full product name for better
                  results.
                </p>
              </div>
            </aside>

            <section className="flex-[2]">
              {loading && (
                <p className="mb-4 text-sm text-textSecondary">Searching...</p>
              )}
              {error && !String(error).toLowerCase().includes("abort") && (
                <p className="mb-4 text-sm text-red">Error: {error}</p>
              )}

              {!loading && products.length === 0 && (
                <div className="p-6 bg-white rounded shadow-sm">
                  <p className="text-sm text-textSecondary">
                    No products found.
                  </p>
                </div>
              )}

              {products.length > 0 && (
                <div
                  className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 search-dropdown-scroll max-h-[60vh] overflow-y-auto pr-2"
                  // note: .search-dropdown-scroll styles hide scrollbar via styled-jsx below
                >
                  {products.map((p) => {
                    const imageSrc = resolveImageSrc(p);
                    const name =
                      p?.name ?? p?.title ?? p?.product_name ?? "Product Name";
                    const href = buildHrefFromProduct(p, baseHref);
                    const slugForProps =
                      p?.slug ?? p?.product_slug ?? p?.id ?? p?._id ?? "";
                    let numericPrice = null;
                    try {
                      if (Array.isArray(p.variants) && p.variants.length > 0) {
                        const v = p.variants[0];
                        const vprice = v?.price ?? v?.base_price ?? null;
                        if (
                          vprice !== null &&
                          vprice !== undefined &&
                          !Number.isNaN(Number(vprice))
                        )
                          numericPrice = Number(vprice);
                      }
                      if (
                        numericPrice === null &&
                        p.price !== undefined &&
                        p.price !== null &&
                        !Number.isNaN(Number(p.price))
                      )
                        numericPrice = Number(p.price);
                      if (
                        numericPrice === null &&
                        p.base_price !== undefined &&
                        p.base_price !== null &&
                        !Number.isNaN(Number(p.base_price))
                      )
                        numericPrice = Number(p.base_price);
                    } catch (e) {}

                    const oldPrice =
                      p.old_price !== undefined && p.old_price !== null
                        ? Number(p.old_price)
                        : p.original_price ?? null;

                    const vendorName =
                      p.vendor?.shop_name ?? p.vendor?.name ?? null;
                    const vendorId = p.vendor?.id ?? p.vendorId ?? null;
                    const isNew = !!(
                      p.is_new ||
                      p.isNew ||
                      p.featured?.is_featured
                    );
                    const discount = p.discount ?? 0;

                    // Wrap Card3 in a clickable div so we can close dropdown on click (before navigation)
                    return (
                      <div
                        key={p.id ?? p._id ?? slugForProps}
                        className="group block"
                        onClick={() => {
                          try {
                            onClose();
                          } catch (e) {}
                        }}
                      >
                        <Card3
                          product={p}
                          imageSrc={imageSrc}
                          isNew={isNew}
                          discount={discount}
                          name={name}
                          slug={slugForProps}
                          vendorId={vendorId}
                          vendorName={vendorName}
                          rating={p.rating ?? 0}
                          price={numericPrice}
                          oldPrice={oldPrice}
                          category={p.category?.name ?? p.category ?? ""}
                          href={href}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </div>

        <div
          className="absolute top-4 right-6 flex items-center gap-2 cursor-pointer z-50"
          onClick={onClose}
        >
          <button
            aria-label="Close search panel"
            className="flex items-center justify-center w-9 h-9 rounded-full bg-white shadow hover:bg-gray-50 transition"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* hide scrollbar visually but keep scrolling functional (cross-browser) */}
      <style jsx global>{`
        .search-dropdown-scroll {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        .search-dropdown-scroll::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
          width: 0;
          height: 0;
        }
      `}</style>
    </>
  );
}
