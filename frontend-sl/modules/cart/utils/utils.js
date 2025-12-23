// modules/cart/utils/utils.js

/**
 * Safely convert a value to number. Returns 0 for null/undefined/NaN/non-finite.
 * Named export: toNumber
 */
export function toNumber(value) {
  if (value === null || value === undefined) return 0;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Format price to fixed 2 decimals as string.
 * Named export: formatPrice
 */
export function formatPrice(value) {
  const n = toNumber(value);
  return n.toFixed(2);
}
