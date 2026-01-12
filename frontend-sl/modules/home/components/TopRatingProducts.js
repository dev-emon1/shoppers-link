"use client";

import ProductSection from "@/components/product/ProductSection";
import useTopRatingProducts from "@/modules/home/hooks/useTopRatingProducts";

const TopRatingProducts = () => {
  const { products, loading, error } = useTopRatingProducts({
    mode: "home",
  });

  return (
    <ProductSection
      products={products}
      loading={loading}
      error={error}
      title="Top Rated Products"
      subtitle="Highly rated products by customers"
      viewAllHref="/products?type=top-rating"
    />
  );
};

export default TopRatingProducts;
