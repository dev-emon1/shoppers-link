"use client";

import ProductSection from "@/components/product/ProductSection";
import useTopSellingProducts from "@/modules/home/hooks/useTopSellingProducts";

const TopSellingProducts = () => {
  const { products, loading, error } = useTopSellingProducts({
    mode: "home",
  });

  return (
    <ProductSection
      products={products}
      loading={loading}
      error={error}
      title="Top Selling Products"
      subtitle="Best selling products customers love"
      viewAllHref="/products?type=top-selling"
      showSoldCount={true}
    />
  );
};

export default TopSellingProducts;
