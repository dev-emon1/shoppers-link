"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

/* ---------------- Layout & UI ---------------- */
import ProductsLayout from "@/modules/product/components/product-listing/ProductsLayout";
import ListingHeader from "@/components/shared/ListingHeader/ListingHeader";
import ListingSidebar from "@/components/shared/ListingSidebar/ListingSidebar";
import ProductGrid from "@/modules/product/components/product-listing/ProductGrid";
import ProductsList from "@/modules/product/components/product-listing/ProductsList";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";

/* ---------------- Data & Hooks ---------------- */
import useSearchProducts from "@/modules/search/hooks/useSearchProducts";
import useSortedProducts from "@/modules/product/hooks/useSortedProducts";
import useProductFilters from "@/modules/product/hooks/useProductFilters";

const PER_LOAD = 12;

/* ======================================================
   URL <-> Filter helpers (PAGE LEVEL)
====================================================== */
function parseFilters(sp) {
  return {
    brands: (sp.get("brands") || "").split(",").filter(Boolean),
    ratings: (sp.get("ratings") || "").split(",").map(Number).filter(Boolean),
    availability: sp.get("in_stock") || null,
    price:
      (sp.get("price") || "")
        .split("-")
        .map(Number)
        .filter((n) => !isNaN(n)).length === 2
        ? (sp.get("price") || "").split("-").map(Number)
        : [],
  };
}

function filtersToQuery(filters) {
  const q = new URLSearchParams();

  if (filters.brands?.length) q.set("brands", filters.brands.join(","));
  if (filters.ratings?.length) q.set("ratings", filters.ratings.join(","));
  if (filters.availability) q.set("in_stock", filters.availability);
  if (filters.price?.length === 2)
    q.set("price", `${filters.price[0]}-${filters.price[1]}`);

  return q;
}

export default function SearchPage() {
  /* ---------------- Routing ---------------- */
  const sp = useSearchParams();
  const router = useRouter();

  const query = sp.get("q") || "";
  const categoryId = sp.get("category_id");

  /* ---------------- UI state ---------------- */
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("newest");
  const [filterOpen, setFilterOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PER_LOAD);

  /* ---------------- Fetch search results ---------------- */
  const {
    items = [],
    total,
    loading,
    isEmpty,
  } = useSearchProducts({
    query,
    categoryId,
  });

  /* ---------------- Normalize total ---------------- */
  const safeTotal = useMemo(() => {
    if (Array.isArray(total)) return total[0];
    return Number(total) || items.length;
  }, [total, items.length]);

  /* ---------------- Reset load-more on query/category change ---------------- */
  useEffect(() => {
    setVisibleCount(PER_LOAD);
  }, [query, categoryId]);

  /* ---------------- URL -> Initial Filters ---------------- */
  const initialFilters = useMemo(() => parseFilters(sp), [sp.toString()]);

  /* ---------------- Filters Hook (PURE) ---------------- */
  const { selected, setSelected, filteredProducts, clearFilters, activeCount } =
    useProductFilters({
      products: items,
      initialFilters,
      onFiltersChange: (next) => {
        const q = filtersToQuery(next);

        const base = new URLSearchParams();
        if (query) base.set("q", query);
        if (categoryId) base.set("category_id", categoryId);

        router.replace(`?${base.toString()}&${q.toString()}`, {
          scroll: false,
        });
      },
    });

  /* ---------------- Visible products (after filtering) ---------------- */
  const visibleFilteredProducts = useMemo(
    () => filteredProducts.slice(0, visibleCount),
    [filteredProducts, visibleCount]
  );

  /* ---------------- Sorting (AFTER filtering) ---------------- */
  const sortedProducts = useSortedProducts(visibleFilteredProducts, sort);

  const hasMore = visibleCount < filteredProducts.length;

  /* ---------------- Render ---------------- */
  return (
    <ProductsLayout
      sidebar={
        <ListingSidebar
          mode="filter"
          selected={selected}
          onFilterChange={setSelected}
          mobileOpen={filterOpen}
          onCloseMobile={() => setFilterOpen(false)}
        />
      }
      topbar={
        <ListingHeader
          title={query ? `Search results for “${query}”` : "Search Products"}
          total={filteredProducts.length}
          view={view}
          sort={sort}
          showControls
          onViewChange={setView}
          onSortChange={setSort}
          onOpenFilter={() => setFilterOpen(true)}
          filterCount={activeCount}
          onClearFilters={clearFilters}
        />
      }
    >
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader />
        </div>
      ) : isEmpty || filteredProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          description={
            query ? `No products matched “${query}”` : "No products available"
          }
        />
      ) : view === "grid" ? (
        <ProductGrid
          products={sortedProducts}
          hasMore={hasMore}
          onLoadMore={() => setVisibleCount((prev) => prev + PER_LOAD)}
        />
      ) : (
        <ProductsList products={sortedProducts} />
      )}
    </ProductsLayout>
  );
}
