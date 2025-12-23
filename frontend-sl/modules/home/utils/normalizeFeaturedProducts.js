// utils/normalizeFeaturedProducts.js
export const normalizeFeaturedProducts = (raw) => {
  const now = new Date(); // Current date: Dec 21, 2025

  // Filter active and non-expired items
  const filtered = raw.filter(
    (item) => item.is_active && new Date(item.ends_at) > now
  );

  // Merge outer featured data into product
  return filtered.map((item) => ({
    ...item.product,
    featured: {
      ...item.product.featured,
      badge_text: item.badge_text || item.product.featured?.badge_text || null,
      badge_color:
        item.badge_color || item.product.featured?.badge_color || null,
      ends_at: item.ends_at || item.product.featured?.ends_at || null,
      is_active: item.is_active || item.product.featured?.is_active || false,
    },
  }));
};
