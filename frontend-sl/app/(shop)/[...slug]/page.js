"use client";

import { use, useState } from "react";
import { makeCrumbsFromSlug } from "@/lib/breadcrumb";

/* UI */
import CategoryHeroGrid from "@/modules/category/components/CategoryHeroGrid";
import ProductGrid from "@/modules/product/components/product-listing/ProductGrid";
import ProductsList from "@/modules/product/components/product-listing/ProductsList";
import ProductsLayout from "@/modules/product/components/product-listing/ProductsLayout";
import ListingHeader from "@/components/shared/ListingHeader/ListingHeader";
import ListingSidebar from "@/components/shared/ListingSidebar/ListingSidebar";
import Loader from "@/components/ui/Loader";

/* Product */
import ProductDetails from "@/modules/product/components/product-details";
import RelatedProducts from "@/modules/product/components/RelatedProducts";

/* Hooks */
import { useCategoryFinders } from "@/modules/category/hooks/useCategoryFinders";
import useProductsForChild from "@/modules/category/hooks/useProductsForChild";
import useSortedProducts from "@/modules/product/hooks/useSortedProducts";
import useProductFilters from "@/modules/product/hooks/useProductFilters";

export default function CategoryPage({ params }) {
  /* ---------------- UI State ---------------- */
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("newest");
  const [filterOpen, setFilterOpen] = useState(false);

  /* ---------------- Params ---------------- */
  const resolvedParams =
    typeof params?.then === "function" ? use(params) : params;

  const segments = Array.isArray(resolvedParams?.slug)
    ? resolvedParams.slug
    : [];

  const [catSlug, subSlug, childSlug, productSlug] = segments;

  /* ---------------- Category Finders ---------------- */
  const {
    getCategoryBySlug,
    getSubcategoryBySlug,
    getChildBySlug,
    getSidebarTree,
  } = useCategoryFinders();

  const cat = getCategoryBySlug(catSlug);
  const sub = subSlug ? getSubcategoryBySlug(catSlug, subSlug) : null;
  const child = childSlug ? getChildBySlug(catSlug, subSlug, childSlug) : null;

  const breadcrumb = makeCrumbsFromSlug(segments);

  const isProductPage = !!productSlug;
  const isChildPage = !!child && !productSlug;
  const isSubcategoryPage = !!sub && !child;
  const isCategoryPage = !!cat && !sub && !child;

  /* ---------------- Products ---------------- */
  const {
    products: baseProducts = [],
    loading: productsLoading,
    error: productsError,
    deriveFilters,
  } = useProductsForChild({ catSlug, subSlug, childSlug });

  /* ---------------- Filters Hook (ALWAYS CALLED) ---------------- */
  const { selected, setSelected, filteredProducts, clearFilters, activeCount } =
    useProductFilters(isChildPage ? baseProducts : []);

  const sortedProducts = useSortedProducts(
    isChildPage ? filteredProducts : [],
    sort
  );

  /* ======================================================
     1️⃣ PRODUCT DETAILS PAGE
  ====================================================== */
  if (isProductPage) {
    const product = baseProducts.find((p) => p.slug === productSlug);

    if (!product) {
      return (
        <div className="container py-20 text-center text-gray-500">
          Product not found.
        </div>
      );
    }

    const related = baseProducts
      .filter((p) => p.slug !== product.slug)
      .slice(0, 8);

    return (
      <div className="mt-6">
        <ProductDetails product={product} breadcrumb={breadcrumb} />
        <RelatedProducts product={product} products={related} />
      </div>
    );
  }

  /* ======================================================
     2️⃣ CATEGORY LANDING PAGE
  ====================================================== */
  if (isCategoryPage) {
    const heroItems = (cat?.sub_categories || []).map((s) => ({
      id: s.id,
      name: s.name,
      image: s.image,
      href: `/${cat.slug}/${s.slug}`,
    }));

    return (
      <div className="mt-6">
        <ListingHeader title={cat.name} breadcrumb={breadcrumb} />

        <div className="container grid grid-cols-1 md:grid-cols-12 gap-6 py-10">
          <aside className="md:col-span-3">
            <ListingSidebar
              mode="tree"
              category={cat}
              tree={getSidebarTree(catSlug)}
              active={{ sub: null, child: null }}
            />
          </aside>

          <main className="md:col-span-9">
            <CategoryHeroGrid items={heroItems} variant="pill" />
          </main>
        </div>
      </div>
    );
  }

  /* ======================================================
     3️⃣ SUBCATEGORY PAGE
  ====================================================== */
  if (isSubcategoryPage) {
    const heroItems = (sub?.child_categories || []).map((c) => ({
      id: c.id,
      name: c.name,
      image: c.image,
      href: `/${cat.slug}/${sub.slug}/${c.slug}`,
    }));

    return (
      <div className="mt-6">
        <ListingHeader title={sub.name} breadcrumb={breadcrumb} />

        <div className="container grid grid-cols-1 md:grid-cols-12 gap-6 py-10">
          <aside className="md:col-span-3">
            <ListingSidebar
              mode="tree"
              category={cat}
              tree={getSidebarTree(catSlug)}
              active={{ sub: subSlug, child: null }}
            />
          </aside>

          <main className="md:col-span-9">
            <CategoryHeroGrid items={heroItems} variant="pill" />
          </main>
        </div>
      </div>
    );
  }

  /* ======================================================
     4️⃣ CHILD CATEGORY (PLP)
  ====================================================== */
  if (isChildPage) {
    const filters = deriveFilters(baseProducts);

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
            title={child.name}
            breadcrumb={breadcrumb}
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
        {productsLoading ? (
          <div className="py-20 text-center">
            <Loader />
          </div>
        ) : productsError ? (
          <div className="py-20 text-center text-red-500">
            Failed to load products.
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            No products found.
          </div>
        ) : view === "grid" ? (
          <ProductGrid
            products={sortedProducts}
            baseHref={`/${catSlug}/${subSlug}/${childSlug}`}
          />
        ) : (
          <ProductsList products={sortedProducts} />
        )}
      </ProductsLayout>
    );
  }

  /* ======================================================
     FALLBACK
  ====================================================== */
  return (
    <div className="container py-20 text-center text-gray-500">
      Page not found.
    </div>
  );
}
