import ProductSection from "@/components/product/ProductSection";
// Reusable product section component used across the homepage

import useNewArrivals from "@/modules/home/hooks/useNewArrivals";
// Custom hook responsible for fetching "New Arrivals" products

// Wrapper component for the New Arrivals section
const NewArrivals = () => (
  <ProductSection
    useProductsHook={useNewArrivals} // Injects New Arrivals data-fetching logic
    title="New Arrivals" // Section title
    subtitle="Discover our latest products" // Section subtitle
    viewAllHref="/products?type=new-arrivals" // Link to full New Arrivals listing page
  />
);

export default NewArrivals;
// Export component for use on homepage or other layouts
