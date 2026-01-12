"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";

/* Data hooks */
import useNewArrivalsProducts from "@/modules/home/hooks/useNewArrivalsProducts";
import useTopSellingProducts from "@/modules/home/hooks/useTopSellingProducts";
import useTopRatingProducts from "@/modules/home/hooks/useTopRatingProducts";
import useFeaturedProducts from "@/modules/home/hooks/useFeaturedProducts";

/* Filter + sort */
import useProductFilters from "@/modules/product/hooks/useProductFilters";
import useSortedProducts from "@/modules/product/hooks/useSortedProducts";

/* Layout */
import ProductsLayout from "@/modules/product/components/product-listing/ProductsLayout";
import ListingHeader from "@/components/shared/ListingHeader/ListingHeader";
import ListingSidebar from "@/components/shared/ListingSidebar/ListingSidebar";

/* UI */
import ProductGrid from "@/modules/product/components/product-listing/ProductGrid";
import ProductsList from "@/modules/product/components/product-listing/ProductsList";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";

/* -----------------------------
   Helper: URL -> filter object
----------------------------- */
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

export default function ProductsPage() {
  const sp = useSearchParams();
  const router = useRouter();
  const type = sp.get("type");

  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("newest");
  const [filterOpen, setFilterOpen] = useState(false);

  /* -----------------------------
     Resolve product source
     (LOGIC FIXED HERE)
  ----------------------------- */
  const hookResult = useMemo(() => {
    switch (type) {
      case "featured":
        return {
          title: "Featured Products",
          hook: () => useFeaturedProducts({ mode: "listing" }),
        };

      case "new-arrivals":
        return {
          title: "New Arrivals",
          hook: () => useNewArrivalsProducts({ mode: "listing" }),
        };

      case "top-selling":
        return {
          title: "Top Selling Products",
          hook: () => useTopSellingProducts({ mode: "listing" }),
        };

      case "top-rating":
        return {
          title: "Top Rated Products",
          hook: () => useTopRatingProducts({ mode: "listing" }),
        };

      default:
        return null;
    }
  }, [type]);

  const dataHook =
    hookResult?.hook ??
    (() => ({
      products: [],
      loading: false,
      error: false,
      hasMore: false,
      loadMore: undefined,
    }));

  /**
   * 🔑 IMPORTANT FIX
   * Handle paginated + non-paginated hooks safely
   */
  const {
    products = [],
    loading,
    error,
    hasMore = false,
    loadMore,
  } = dataHook();

  /* -----------------------------
     URL -> filters (PAGE LEVEL)
  ----------------------------- */
  const initialFilters = useMemo(() => parseFilters(sp), [sp.toString()]);

  /* -----------------------------
     Filters hook (PURE)
  ----------------------------- */
  const { selected, setSelected, filteredProducts, clearFilters, activeCount } =
    useProductFilters({
      products,
      initialFilters,
      onFiltersChange: (next) => {
        const q = filtersToQuery(next);
        router.replace(`?type=${type}&${q.toString()}`, { scroll: false });
      },
    });

  /* -----------------------------
     Sorting
  ----------------------------- */
  const sortedProducts = useSortedProducts(filteredProducts, sort);

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
          title={hookResult?.title || "Products"}
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
      {!hookResult ? (
        <EmptyState title="Invalid Product View" />
      ) : loading ? (
        <div className="py-20 flex justify-center">
          <Loader />
        </div>
      ) : error ? (
        <EmptyState title="Failed to load products" />
      ) : filteredProducts.length === 0 ? (
        <EmptyState title="No products found" />
      ) : view === "grid" ? (
        <ProductGrid
          products={sortedProducts}
          hasMore={hasMore}
          loading={loading}
          onLoadMore={loadMore}
        />
      ) : (
        <ProductsList
          products={sortedProducts}
          hasMore={hasMore}
          loading={loading}
          onLoadMore={loadMore}
        />
      )}
    </ProductsLayout>
  );
}
