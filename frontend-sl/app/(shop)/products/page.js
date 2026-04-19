"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchProducts,
  fetchVendorProductsThunk,
} from "@/modules/product/store/productReducer";

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
   Helper: URL → Filters
----------------------------- */
function parseFilters(sp) {
  return {
    vendors: (sp.get("vendor") || "").split(",").map(Number).filter(Boolean),

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

  if (filters.vendors?.length) q.set("vendor", filters.vendors.join(","));

  if (filters.ratings?.length) q.set("ratings", filters.ratings.join(","));

  if (filters.availability) q.set("in_stock", filters.availability);

  if (filters.price?.length === 2)
    q.set("price", `${filters.price[0]}-${filters.price[1]}`);

  return q;
}

export default function ProductsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const sp = useSearchParams();

  const { list, itemsById, loading, error } = useSelector(
    (state) => state.products,
  );

  const products = list.map((id) => itemsById[id]);

  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("newest");
  const [filterOpen, setFilterOpen] = useState(false);

  /* -----------------------------
     Initial Filters from URL
  ----------------------------- */
  const initialFilters = useMemo(() => parseFilters(sp), [sp]);

  const [selected, setSelected] = useState(initialFilters);

  /* -----------------------------
     Fetch Products (Redux)
  ----------------------------- */
  useEffect(() => {
    const vendor = sp.get("vendor");

    if (vendor) {
      dispatch(fetchVendorProductsThunk({ vendor }));
    } else {
      dispatch(fetchProducts(Object.fromEntries(sp.entries())));
    }
  }, [dispatch, sp]);

  /* -----------------------------
     Vendor Filter (Frontend)
  ----------------------------- */
  let filteredProducts = products;

  if (selected.vendors?.length) {
    filteredProducts = filteredProducts.filter((p) =>
      selected.vendors.includes(p.vendor?.id),
    );
  }

  if (selected.availability === "in") {
    filteredProducts = filteredProducts.filter(
      (p) => (p.stock_quantity ?? 1) > 0,
    );
  }

  if (selected.price?.length === 2) {
    filteredProducts = filteredProducts.filter(
      (p) => p.price >= selected.price[0] && p.price <= selected.price[1],
    );
  }

  /* -----------------------------
     Sorting
  ----------------------------- */
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sort) {
      case "price-asc":
        return a.price - b.price;
      case "price-desc":
        return b.price - a.price;
      case "rating":
        return b.avg_rating - a.avg_rating;
      default:
        return new Date(b.created_at) - new Date(a.created_at);
    }
  });

  /* -----------------------------
     Vendor List for Sidebar
  ----------------------------- */
  const filters = useMemo(() => {
    const map = new Map();

    products.forEach((p) => {
      if (p.vendor) {
        map.set(p.vendor.id, {
          id: p.vendor.id,
          name: p.vendor.shop_name,
        });
      }
    });

    return {
      vendors: Array.from(map.values()),
    };
  }, [products]);

  /* -----------------------------
     Vendor Name (Header)
  ----------------------------- */
  const vendorName = filters.vendors.find((v) =>
    selected.vendors?.includes(v.id),
  )?.name;

  /* -----------------------------
     URL Sync
  ----------------------------- */
  useEffect(() => {
    const q = filtersToQuery(selected);
    router.replace(`?${q.toString()}`, { scroll: false });
  }, [selected]);

  return (
    <ProductsLayout
      sidebar={
        <ListingSidebar
          mode="filter"
          filters={filters}
          selected={selected}
          onFilterChange={setSelected}
          mobileOpen={filterOpen}
          onCloseMobile={() => setFilterOpen(false)}
        />
      }
      topbar={
        <ListingHeader
          title={vendorName || "Products"}
          total={sortedProducts.length}
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
        <div className="py-20 flex justify-center">
          <Loader />
        </div>
      ) : error ? (
        <EmptyState title="Failed to load products" />
      ) : sortedProducts.length === 0 ? (
        <EmptyState title="No products found" />
      ) : view === "grid" ? (
        <ProductGrid products={sortedProducts} />
      ) : (
        <ProductsList products={sortedProducts} />
      )}
    </ProductsLayout>
  );
}
