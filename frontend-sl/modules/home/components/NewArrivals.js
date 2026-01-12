"use client";

import ProductSection from "@/components/product/ProductSection";
import useNewArrivalsProducts from "@/modules/home/hooks/useNewArrivalsProducts";

const NewArrivals = () => {
  const { products, loading, error } = useNewArrivalsProducts({
    mode: "home",
  });

  return (
    <ProductSection
      products={products}
      loading={loading}
      error={error}
      title="New Arrivals"
      subtitle="Discover our latest products"
      viewAllHref="/products?type=new-arrivals"
    />
  );
};

export default NewArrivals;
