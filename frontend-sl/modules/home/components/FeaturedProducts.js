"use client";

import ProductSection from "@/components/product/ProductSection";
import useFeaturedProducts from "@/modules/home/hooks/useFeaturedProducts";

const FeaturedProducts = () => {
  const { products, loading, error } = useFeaturedProducts({
    mode: "home",
  });

  return (
    <ProductSection
      products={products}
      loading={loading}
      error={error}
      title="Featured Products"
      subtitle="Explore our highlighted selections"
      viewAllHref="/products?type=featured"
    />
  );
};

export default FeaturedProducts;
