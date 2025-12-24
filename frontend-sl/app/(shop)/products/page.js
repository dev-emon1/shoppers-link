"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

/* -----------------------------
   Hooks (data source)
----------------------------- */
import useFeaturedProducts from "@/modules/home/hooks/useFeaturedProducts";
import useNewArrivals from "@/modules/home/hooks/useNewArrivals";
import useTopSellingProducts from "@/modules/home/hooks/useTopSellingProducts";
import useTopRatingProducts from "@/modules/home/hooks/useTopRatingProducts";
import useSortedProducts from "@/modules/product/hooks/useSortedProducts";

/* -----------------------------
   Layout & Shared UI
----------------------------- */
import ProductsLayout from "@/modules/product/components/product-listing/ProductsLayout";
import ListingHeader from "@/components/shared/ListingHeader/ListingHeader";
import ListingSidebar from "@/components/shared/ListingSidebar/ListingSidebar";

/* -----------------------------
   Product UI
----------------------------- */
import ProductGrid from "@/modules/product/components/product-listing/ProductGrid";
import ProductsList from "@/modules/product/components/product-listing/ProductsList";

import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  /* -----------------------------
     UI state
  ----------------------------- */
  const [view, setView] = useState("grid"); // grid | list
  const [sort, setSort] = useState("newest");
  const [filterOpen, setFilterOpen] = useState(false);

  /* -----------------------------
     Hook resolver
  ----------------------------- */
  const hookResult = useMemo(() => {
    switch (type) {
      case "featured":
        return { title: "Featured Products", hook: useFeaturedProducts };
      case "new-arrivals":
        return { title: "New Arrivals", hook: useNewArrivals };
      case "top-selling":
        return { title: "Top Selling Products", hook: useTopSellingProducts };
      case "top-rating":
        return { title: "Top Rated Products", hook: useTopRatingProducts };
      default:
        return null;
    }
  }, [type]);

  /* -----------------------------
     Invalid route protection
  ----------------------------- */
  if (!hookResult) {
    return (
      <EmptyState
        title="Invalid Product View"
        description="The requested product list is not available."
      />
    );
  }

  /* -----------------------------
     Fetch products
  ----------------------------- */
  const { products = [], loading, error } = hookResult.hook();

  /* -----------------------------
   Frontend sorting (scalable)
----------------------------- */
  const sortedProducts = useSortedProducts(products, sort);

  return (
    <ProductsLayout
      sidebar={
        <ListingSidebar
          mode="filter"
          mobileOpen={filterOpen}
          onCloseMobile={() => setFilterOpen(false)}
          /* future:
             filters={}
             selected={}
             onFilterChange={}
          */
        />
      }
      topbar={
        <ListingHeader
          title={hookResult.title}
          total={products.length}
          view={view}
          sort={sort}
          showControls
          onViewChange={setView}
          onSortChange={setSort}
          onOpenFilter={() => setFilterOpen(true)}
        />
      }
    >
      {/* ---------------- Content ---------------- */}
      {loading ? (
        <div className="py-20 flex justify-center">
          <Loader />
        </div>
      ) : error ? (
        <EmptyState title="Failed to load products" />
      ) : products.length === 0 ? (
        <EmptyState title="No products found" />
      ) : view === "grid" ? (
        <ProductGrid products={sortedProducts} />
      ) : (
        <ProductsList products={sortedProducts} />
      )}
    </ProductsLayout>
  );
}
