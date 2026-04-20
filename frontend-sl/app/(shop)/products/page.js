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
     🔑 Call all hooks at top level
  ----------------------------- */
  const featured = useFeaturedProducts({ mode: "listing" });
  const newArrivals = useNewArrivalsProducts({ mode: "listing" });
  const topSelling = useTopSellingProducts({ mode: "listing" });
  const topRating = useTopRatingProducts({ mode: "listing" });

  let hookResult = null;

  switch (type) {
    case "featured":
      hookResult = {
        title: "Featured Products",
        data: featured,
      };
      break;

    case "new-arrivals":
      hookResult = {
        title: "New Arrivals",
        data: newArrivals,
      };
      break;

    case "top-selling":
      hookResult = {
        title: "Top Selling Products",
        data: topSelling,
      };
      break;

    case "top-rating":
      hookResult = {
        title: "Top Rated Products",
        data: topRating,
      };
      break;

    default:
      hookResult = null;
  }

  const {
    products = [],
    loading,
    error,
    hasMore = false,
    loadMore,
  } = hookResult?.data || {};

  /* -----------------------------
     URL -> filters
  ----------------------------- */
  const initialFilters = useMemo(() => parseFilters(sp), [sp]);

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
