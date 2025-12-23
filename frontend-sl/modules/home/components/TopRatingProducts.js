import ProductSection from "@/components/product/ProductSection";
// Reusable product section component

import useTopRatingProducts from "@/modules/home/hooks/useTopRatingProducts";
// Custom hook responsible for fetching "Top Rating" products

const TopRating = () => (
  <ProductSection
    useProductsHook={useTopRatingProducts}
    title="Top Rated Products"
    subtitle="Highly rated by customers across all categories"
    viewAllHref="/products?type=top-rating"
  />
);

export default TopRating;
