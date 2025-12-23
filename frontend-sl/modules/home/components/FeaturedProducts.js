import ProductSection from "@/components/product/ProductSection";
// Reusable product section component

import useFeaturedProducts from "../hooks/useFeaturedProducts";
// Custom hook responsible for fetching featured products

// Lightweight wrapper component for Featured Products section
const FeaturedProducts = () => (
  <ProductSection
    useProductsHook={useFeaturedProducts} // Inject data-fetching hook
    title="Featured Products" // Section title
    subtitle="Explore our highlighted selections" // Section subtitle
    viewAllHref="/products?type=featured" // View-all page link
  />
);

export default FeaturedProducts;
// Export component for homepage or other layouts
