/**
 * deriveProductFilters
 * Pure utility function
 *
 * @param {Array} products
 * @returns {Object} filter options
 */
export function deriveProductFilters(products = []) {
  if (!Array.isArray(products) || products.length === 0) {
    return {
      brands: [],
      ratings: [],
      priceRange: [],
      vendors: [],
    };
  }

  /* ---------- Brand ---------- */
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];

  /* ---------- Ratings ---------- */
  const ratingSteps = [5, 4, 3, 2, 1];
  const ratings = ratingSteps.filter((r) =>
    products.some((p) => Number(p.rating) >= r)
  );

  /* ---------- Price Range ---------- */
  const prices = products.map((p) => Number(p.price)).filter((n) => !isNaN(n));

  const priceRange =
    prices.length > 0 ? [Math.min(...prices), Math.max(...prices)] : [];

  /* ---------- Vendors (future-ready) ---------- */
  const vendors = [
    ...new Map(
      products
        .filter((p) => p.vendor_id && p.vendor_name)
        .map((p) => [p.vendor_id, { id: p.vendor_id, name: p.vendor_name }])
    ).values(),
  ];

  return {
    brands,
    ratings,
    priceRange,
    vendors,
  };
}
