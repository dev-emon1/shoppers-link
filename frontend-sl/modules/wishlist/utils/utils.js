// modules/wishlist/utils/utils.js

/**
 * Safe numeric helpers for wishlist module
 */

export function toNumber(value) {
  if (value === null || value === undefined) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function formatPrice(value) {
  const n = toNumber(value);
  return n.toFixed(2);
}
