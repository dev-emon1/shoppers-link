"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "next/navigation";

import { fetchVendorProductsThunk } from "@/modules/product/store/productReducer";

import ProductsLayout from "@/modules/product/components/product-listing/ProductsLayout";
import ProductGrid from "@/modules/product/components/product-listing/ProductGrid";

import ListingHeader from "@/components/shared/ListingHeader/ListingHeader";
import ListingSidebar from "@/components/shared/ListingSidebar/ListingSidebar";

import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";

export default function VendorProductsPage() {
  const { vendorId } = useParams();
  const dispatch = useDispatch();

  const { vendorList, vendorItemsById, loading, error } = useSelector(
    (state) => state.products,
  );

  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("newest");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    if (vendorId) {
      dispatch(fetchVendorProductsThunk({ vendor: vendorId }));
    }
  }, [vendorId, dispatch]);

  /* ----------------------------------
     🔥 Normalize products
  ---------------------------------- */
  const products = useMemo(() => {
    return (vendorList || [])
      .map((id) => {
        const p = vendorItemsById[id];
        if (!p) return null;

        return {
          ...p,
          sub_category: p.subCategory,
          child_category: p.childCategory,
        };
      })
      .filter(Boolean);
  }, [vendorList, vendorItemsById]);

  /* ----------------------------------
     🔥 NEW: Dynamic vendor name
  ---------------------------------- */
  const vendorName = useMemo(() => {
    if (!products.length) return "Vendor";

    return (
      products[0]?.vendor?.shop_name || products[0]?.vendor?.name || "Vendor"
    );
  }, [products]);

  return (
    <ProductsLayout
      sidebar={
        <ListingSidebar
          mode="filter"
          filters={{
            brands: [],
            ratings: [],
            priceRange: [],
            vendors: [],
          }}
          selected={{}}
          onFilterChange={() => {}}
          mobileOpen={filterOpen}
          onCloseMobile={() => setFilterOpen(false)}
        />
      }
      topbar={
        <ListingHeader
          title={vendorName}
          breadcrumb={[{ label: "Home", href: "/" }, { label: vendorName }]}
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
      {loading ? (
        <Loader />
      ) : error ? (
        <EmptyState title="Failed to load vendor products" />
      ) : products.length === 0 ? (
        <EmptyState title="No products found" />
      ) : (
        <ProductGrid products={products} />
      )}
    </ProductsLayout>
  );
}
