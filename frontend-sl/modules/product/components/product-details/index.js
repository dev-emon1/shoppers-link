"use client";
import React, { useState } from "react";
import ProductGallery from "./ProductGallery";
import ProductSummary from "./ProductSummary";
import ProductDescription from "./ProductDescription";
import ProductSpecifications from "./ProductSpecifications";
import ProductReviews from "./reviews/ProductReviews";
import ProductHeader from "../ProductHeader";

export default function ProductDetails({ product, breadcrumb = [] }) {
  console.log(product);
  if (!product) {
    return (
      <div className="container py-20 text-center text-gray-500">
        Product not found.
      </div>
    );
  }
  // console.log(product);
  const categoryId = product.category.id;
  const [selectedVariant, setSelectedVariant] = useState(null);

  const defaultBreadcrumb = [
    { label: "Home", href: "/" },
    {
      label: product.category?.name || "Women",
      href: `/${product.category?.slug}`,
    },
    {
      label: product.sub_category?.name || "Saree",
      href: `/${product.category?.slug}/${product.sub_category?.slug}`,
    },
    {
      label: product.child_category?.name || "Printed Saree",
      href: `/${product.category?.slug}/${product.sub_category?.slug}/${product.child_category?.slug}`,
    },
    { label: product.name },
  ];

  const finalBreadcrumb =
    breadcrumb.length > 0 ? breadcrumb : defaultBreadcrumb;

  const handleVariantSelect = (variant) => {
    if (!variant) return setSelectedVariant(null);
    const parsed = (() => {
      try {
        return JSON.parse(variant.attributes || "{}");
      } catch {
        return {};
      }
    })();
    setSelectedVariant({ ...variant, attr: parsed });
  };

  return (
    <>
      <ProductHeader title={product.name} breadcrumb={finalBreadcrumb} />
      <div className="container px-4 py-4 md:py-6 max-w-7xl">
        {/* Mobile & Tablet: Stacked Layout | Desktop: Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Gallery - Full width on mobile, 2 columns on lg+ */}
          <div className="lg:col-span-7 order-1">
            <ProductGallery
              images={product.images}
              variants={product.variants}
              selectedVariant={selectedVariant}
              selectedColor={selectedVariant?.attr?.Color ?? null}
              onSelectVariant={(variantId) => {
                const v = product.variants?.find(
                  (x) => String(x.id) === String(variantId)
                );
                if (v) handleVariantSelect(v);
              }}
            />
            <div className="py-6 space-y-10 order-3 hidden md:block">
              <ProductDescription
                text={product.long_description ?? product.short_description}
              />
              <ProductSpecifications specs={product.specifications ?? []} />
            </div>
          </div>

          {/* Product Summary - Full width after gallery on mobile/tablet, sticky sidebar on desktop */}
          <div className="order-2 lg:order-2 lg:col-span-5">
            <div className="bg-white border border-gray-200 p-6 shadow-sm lg:sticky lg:top-20">
              <ProductSummary
                product={product}
                selectedVariant={selectedVariant}
                onVariantSelect={handleVariantSelect}
              />
            </div>
          </div>
        </div>

        {/* Description, Specifications */}
        <div className="py-6 space-y-10 order-3 block md:hidden">
          <ProductDescription
            text={product.long_description ?? product.short_description}
          />
          <ProductSpecifications specs={product.specifications ?? []} />
        </div>

        {/* Reviews Section */}
        {categoryId !== 8 && (
          <div className="py-6 order-4">
            <ProductReviews product={product} />
          </div>
        )}
      </div>
    </>
  );
}
