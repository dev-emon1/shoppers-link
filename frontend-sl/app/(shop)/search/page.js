"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

/* ---------------- Layout & UI ---------------- */
import ProductsLayout from "@/modules/product/components/product-listing/ProductsLayout";
import ListingHeader from "@/components/shared/ListingHeader/ListingHeader";
import ListingSidebar from "@/components/shared/ListingSidebar/ListingSidebar";
import ProductGrid from "@/modules/product/components/product-listing/ProductGrid";
import ProductsList from "@/modules/product/components/product-listing/ProductsList";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";

/* ---------------- Data ---------------- */
import useSearchProducts from "@/modules/search/hooks/useSearchProducts";
import useSortedProducts from "@/modules/product/hooks/useSortedProducts";

const PER_LOAD = 12;

export default function SearchPage() {
  /* ---------------- URL params ---------------- */
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const categoryId = searchParams.get("category_id");

  /* ---------------- UI state ---------------- */
  const [view, setView] = useState("grid"); // grid | list
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

  /* ---------------- Visible products (load more) ---------------- */
  const visibleProducts = useMemo(
    () => items.slice(0, visibleCount),
    [items, visibleCount]
  );

  /* ---------------- Sorting (frontend) ---------------- */
  const sortedProducts = useSortedProducts(visibleProducts, sort);

  const hasMore = visibleCount < safeTotal;

  /* ---------------- Render ---------------- */
  return (
    <ProductsLayout
      sidebar={
        <ListingSidebar
          mode="filter"
          mobileOpen={filterOpen}
          onCloseMobile={() => setFilterOpen(false)}
        />
      }
      topbar={
        <ListingHeader
          title={query ? `Search results for “${query}”` : "Search Products"}
          total={safeTotal}
          view={view}
          sort={sort}
          showControls
          onViewChange={setView}
          onSortChange={setSort}
          onOpenFilter={() => setFilterOpen(true)}
        />
      }
    >
      {/* ---------------- CONTENT ---------------- */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader />
        </div>
      ) : isEmpty ? (
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
