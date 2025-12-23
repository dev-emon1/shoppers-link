// modules/wishlist/hooks/useWishlist.js
"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  addToWishlist,
  toggleWishlist,
  removeFromWishlist,
  clearWishlist,
  setWishlist,
} from "../store/wishlistReducer";

// defensive import: import module (could be function or object)
import buildModule from "../utils/buildWishlistItemFromProduct";

/**
 * Resolve builder function from imported module.
 * Supports these shapes:
 *  - default export function
 *  - module object with .default function
 *  - module object with named export .buildWishlistItemFromProduct
 */
const resolveBuilder = (maybe) => {
  if (!maybe) return null;
  if (typeof maybe === "function") return maybe;
  if (typeof maybe.default === "function") return maybe.default;
  if (typeof maybe.buildWishlistItemFromProduct === "function")
    return maybe.buildWishlistItemFromProduct;
  return null;
};

const buildWishlistItemFromProduct = resolveBuilder(buildModule);

export default function useWishlist() {
  const dispatch = useDispatch();
  const wishlist =
    useSelector((state) => (state.wishlist ? state.wishlist.wishlist : [])) ||
    [];

  // helper to ensure we always store normalized wishlist items
  const ensureItem = (payload) => {
    if (!payload) return null;

    // if payload already looks like normalized (has price and id), return as-is but coerce price
    if (payload.id && payload.price !== undefined && payload.price !== null) {
      const normalized = { ...payload, price: Number(payload.price) || 0 };
      return normalized;
    }

    // fallback: if builder available, use it; otherwise attempt naive normalization
    if (buildWishlistItemFromProduct) {
      try {
        return buildWishlistItemFromProduct({
          product: payload,
          variantId: payload?.variantId ?? null,
        });
      } catch (e) {
        // continue to fallback
        // eslint-disable-next-line no-console
        console.warn("buildWishlistItemFromProduct failed:", e);
      }
    }

    // Last-resort normalization
    const fallbackPrice =
      Number(payload?.price ?? payload?.base_price ?? 0) || 0;
    const fallbackImage =
      (Array.isArray(payload?.images) && payload.images[0]) ||
      payload?.image ||
      payload?.primary_image ||
      null;

    return {
      id: payload.id ?? null,
      productId: payload.id ?? null,
      variantId: payload.variantId ?? null,
      name: payload.name ?? payload.title ?? "Unknown product",
      sku: payload.sku ?? null,
      price: fallbackPrice,
      images: Array.isArray(payload?.images)
        ? payload.images
        : fallbackImage
        ? [fallbackImage]
        : [],
      image: fallbackImage,
      vendorId: payload?.vendor?.id ?? null,
      vendorName: payload?.vendor?.shop_name ?? payload?.vendor?.name ?? null,
      rawProduct: payload,
    };
  };

  return {
    wishlist,
    add: (productOrItem) => {
      const item = ensureItem(productOrItem);
      if (!item) return;
      dispatch(addToWishlist(item));
    },

    toggle: (productOrItem) => {
      const item = ensureItem(productOrItem);
      if (!item) return;
      dispatch(toggleWishlist(item));
    },

    remove: (idOrItem) => {
      const id = typeof idOrItem === "object" ? idOrItem.id : idOrItem;
      if (!id) return;
      dispatch(removeFromWishlist(id));
    },

    clear: () => dispatch(clearWishlist()),
    set: (list) =>
      dispatch(
        setWishlist(
          Array.isArray(list) ? list.map(ensureItem).filter(Boolean) : []
        )
      ),
    isInWishlist: (id) => wishlist.some((p) => p.id === id),
  };
}
