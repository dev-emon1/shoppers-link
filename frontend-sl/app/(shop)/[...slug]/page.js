"use client";

import { use, useMemo, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { makeCrumbsFromSlug } from "@/lib/breadcrumb";

/* UI */
import CategoryHeroGrid from "@/modules/category/components/CategoryHeroGrid";
import ProductGrid from "@/modules/product/components/product-listing/ProductGrid";
import ProductsList from "@/modules/product/components/product-listing/ProductsList";
import ProductsLayout from "@/modules/product/components/product-listing/ProductsLayout";
import ListingHeader from "@/components/shared/ListingHeader/ListingHeader";
import ListingSidebar from "@/components/shared/ListingSidebar/ListingSidebar";

/* Product */
import ProductDetails from "@/modules/product/components/product-details";
import RelatedProducts from "@/modules/product/components/RelatedProducts";

/* Hooks */
import { useCategoryFinders } from "@/modules/category/hooks/useCategoryFinders";
import useProductsForChild from "@/modules/category/hooks/useProductsForChild";
import Loader from "@/components/ui/Loader";

export default function CategoryPage({ params }) {
  /* ---------------- UI State ---------------- */
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("newest");
  const [filterOpen, setFilterOpen] = useState(false);

  const resolvedParams =
    typeof params?.then === "function" ? use(params) : params;

  const segments = Array.isArray(resolvedParams?.slug)
    ? resolvedParams.slug
    : [];

  const [catSlug, subSlug, childSlug, productSlug] = segments;

  const router = useRouter();
  const sp = useSearchParams();

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

  /* ---------------- Products (Child / PLP) ---------------- */
  const {
    products: baseProducts,
    loading: productsLoading,
    error: productsError,
    deriveFilters,
    applyFilters,
  } = useProductsForChild({ catSlug, subSlug, childSlug });

  /* ---------------- Filters from URL ---------------- */
  const [selected, setSelected] = useState({
    brands: (sp.get("brands") || "").split(",").filter(Boolean),
    ratings: (sp.get("ratings") || "").split(",").map(Number).filter(Boolean),
    price:
      (sp.get("price") || "")
        .split("-")
        .map(Number)
        .filter((n) => !isNaN(n)).length === 2
        ? (sp.get("price") || "").split("-").map(Number)
        : [],
  });

  useEffect(() => {
    setSelected({
      brands: (sp.get("brands") || "").split(",").filter(Boolean),
      ratings: (sp.get("ratings") || "").split(",").map(Number).filter(Boolean),
      price:
        (sp.get("price") || "")
          .split("-")
          .map(Number)
          .filter((n) => !isNaN(n)).length === 2
          ? (sp.get("price") || "").split("-").map(Number)
          : [],
    });
  }, [sp.toString()]);

  const filters = isChildPage ? deriveFilters(baseProducts) : null;

  const filtered = useMemo(
    () => (isChildPage ? applyFilters(baseProducts, selected) : []),
    [isChildPage, baseProducts, selected, applyFilters]
  );

  /* ---------------- Helpers ---------------- */
  const getSubCategories = (category) =>
    (category?.sub_categories || category?.subcategories || []) ?? [];

  const getChildCategories = (subcat) =>
    (subcat?.child_categories || subcat?.children || []) ?? [];

  /* ======================================================
     1️⃣ PRODUCT DETAILS PAGE
  ====================================================== */
  if (isProductPage) {
    const product = baseProducts.find((p) => p.slug === productSlug);
    console.log(product);

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
    const heroItems = getSubCategories(cat).map((s) => ({
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
    const heroItems = getChildCategories(sub).map((c) => ({
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
    const onFilterChange = (next) => {
      setSelected(next);

      const q = new URLSearchParams();
      if (next.brands?.length) q.set("brands", next.brands.join(","));
      if (next.ratings?.length) q.set("ratings", next.ratings.join(","));
      if (next.price?.length === 2)
        q.set("price", `${next.price[0]}-${next.price[1]}`);

      router.replace(`?${q.toString()}`);
    };

    return (
      <ProductsLayout
        sidebar={
          <ListingSidebar
            mode="filter"
            category={cat}
            tree={getSidebarTree(catSlug)}
            filters={filters}
            selected={selected}
            onFilterChange={onFilterChange}
            active={{ sub: subSlug, child: childSlug }}
            mobileOpen={filterOpen}
            onCloseMobile={() => setFilterOpen(false)}
          />
        }
        topbar={
          <ListingHeader
            title={child.name}
            breadcrumb={breadcrumb}
            total={filtered.length}
            view={view}
            sort={sort}
            showControls
            onViewChange={setView}
            onSortChange={setSort}
            onOpenFilter={() => setFilterOpen(true)}
          />
        }
      >
        {productsLoading ? (
          <div className="py-20 text-center text-gray-500">
            <Loader />
          </div>
        ) : productsError ? (
          <div className="py-20 text-center text-red-500">
            Failed to load products.
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-500">
            No products found.
          </div>
        ) : view === "grid" ? (
          <ProductGrid
            products={filtered}
            baseHref={`/${catSlug}/${subSlug}/${childSlug}`}
          />
        ) : (
          <ProductsList products={filtered} />
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
