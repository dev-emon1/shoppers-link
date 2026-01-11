"use client";

import Link from "next/link";
import {
  Grid,
  List,
  ChevronDown,
  ChevronRight,
  SlidersHorizontal,
  Home,
} from "lucide-react";

/**
 * ListingHeader
 *
 * Unified header for:
 * - Category / Subcategory
 * - Child Category (PLP)
 * - New Arrivals / Featured / Search
 * - Product Details (breadcrumb + title only)
 *
 * Props:
 * - title?: string
 * - breadcrumb?: [{ label, href }]
 * - total?: number
 * - view?: "grid" | "list"
 * - sort?: string
 * - showControls?: boolean
 * - onViewChange?: fn
 * - onSortChange?: fn
 * - onOpenFilter?: fn (mobile filter drawer)
 */

export default function ListingHeader({
  title,
  breadcrumb = [],
  total,
  view = "grid",
  sort = "newest",
  showControls = false,
  onViewChange = () => {},
  onSortChange = () => {},
  onOpenFilter = () => {},
}) {
  /* ------------------------------------------------------------
     Prevent duplicate "Home > Home"
  ------------------------------------------------------------ */
  const cleanBreadcrumb = breadcrumb.filter(
    (item, index) => !(item?.label?.toLowerCase() === "home" && index !== 0)
  );

  return (
    <div className="container relative z-30 bg-white border border-border mb-4">
      {/* ================= Header (Breadcrumb + Title) ================= */}
      {(title || cleanBreadcrumb.length > 0) && (
        <div className=" py-4">
          {/* Breadcrumb */}
          {cleanBreadcrumb.length > 0 && (
            <nav
              className="flex flex-wrap items-center gap-2 text-sm text-textLight mb-2
            "
            >
              <Link href="/" className="hover:text-main font-medium">
                <Home size={20} />
              </Link>

              {cleanBreadcrumb.map((item, index) => {
                const isLast = index === cleanBreadcrumb.length - 1;

                return (
                  <span key={index} className="flex items-center gap-2">
                    <ChevronRight size={14} className="text-gray-400" />

                    {item.href && !isLast ? (
                      <Link
                        href={item.href}
                        className="hover:text-main font-medium capitalize"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <span className="font-semibold text-main capitalize">
                        {item.label || title}
                      </span>
                    )}
                  </span>
                );
              })}
            </nav>
          )}

          {/* Title */}
          {title && (
            <h1 className="text-lg md:text-2xl font-bold text-textPrimary">
              {title}
            </h1>
          )}
          {/* ================= Controls (Grid / Sort / Filter) ================= */}
          {showControls && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              {/* Left: Result count */}
              {typeof total === "number" && (
                <div className="text-sm text-textLight">
                  Showing{" "}
                  <span className="font-semibold text-textPrimary">
                    {total}
                  </span>{" "}
                  items
                </div>
              )}

              {/* Right: Controls */}
              <div className="flex items-center gap-3 justify-between sm:justify-end">
                {/* Mobile Filter Button */}
                <button
                  type="button"
                  onClick={onOpenFilter}
                  className="lg:hidden flex items-center gap-2 border border-border rounded-md px-3 py-2 text-sm hover:bg-bgPage"
                >
                  <SlidersHorizontal size={16} />
                  Filter
                </button>

                {/* Grid / List Toggle */}
                <div className=" hidden md:flex items-center border border-border rounded-md overflow-hidden">
                  <button
                    type="button"
                    onClick={() => onViewChange("grid")}
                    className={`p-2 transition ${
                      view === "grid"
                        ? "bg-main text-white"
                        : "bg-white text-textLight hover:bg-bgPage"
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onViewChange("list")}
                    className={`p-2 transition ${
                      view === "list"
                        ? "bg-main text-white"
                        : "bg-white text-textLight hover:bg-bgPage"
                    }`}
                    aria-label="List view"
                  >
                    <List size={18} />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="
                  appearance-none border border-border rounded-md
                  px-4 py-2 pr-9 text-sm text-textPrimary
                  focus:outline-none focus:ring-1 focus:ring-main
                "
                  >
                    <option value="newest">Newest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>

                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-textLight pointer-events-none"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
