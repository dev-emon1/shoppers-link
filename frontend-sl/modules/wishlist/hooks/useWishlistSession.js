// modules/wishlist/hooks/useWishlistSession.js
"use client";

import useWishlist from "./useWishlist";

/**
 * Small session-style helpers (non-redux-friendly consumers)
 */
export function useWishlistSession() {
  const { add, remove, clear, wishlist } = useWishlist();

  return {
    wishlist,
    addToWishlist: (item) => add(item),
    removeFromWishlist: (id) => remove(id),
    clearWishlist: () => clear(),
  };
}
