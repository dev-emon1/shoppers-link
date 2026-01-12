/* =========================
   Address Type Normalizer
========================= */

export const ADDRESS_TYPE_MAP = {
  0: "home",
  1: "office",
  home: "home",
  office: "office",
};

/**
 * Normalize backend address_type
 * @param {number|string|undefined|null} type
 * @returns {"home"|"office"}
 */
export function normalizeAddressType(type) {
  return ADDRESS_TYPE_MAP[type] || "home";
}

/**
 * UI display label
 * @param {any} type
 */
export function getAddressTypeLabel(type) {
  return normalizeAddressType(type).toUpperCase();
}
