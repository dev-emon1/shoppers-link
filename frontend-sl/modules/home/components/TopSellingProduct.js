// components/sections/TopSellingProducts.jsx

import ProductSection from "@/components/product/ProductSection";
// Reusable product section component used across the homepage

import useTopSellingProducts from "@/modules/home/hooks/useTopSellingProducts";
// Custom hook responsible for fetching top-selling products

// Wrapper component for the "Top Selling" products section
const TopSellingProducts = () => (
  <ProductSection
    useProductsHook={useTopSellingProducts} // Injects top-selling product data
    title="Top Selling Products" // Section title
    subtitle="Best selling products customers love" // Section subtitle
    viewAllHref="/products?type=top-selling"
    showSoldCount={true}
    // Link to full top-selling products page

    // Optional: force slider mode even when product count is small
    // forceSlider={true}
  />
);

export default TopSellingProducts;
// Export component for use on homepage or other layouts
