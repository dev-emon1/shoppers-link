// modules/wishlist/utils/buildWishlistItemFromProduct.js

import { normalizeImage } from "./image";
import { toNumber } from "./utils";

const DEFAULT_MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_BASE || "http://localhost:8000";

/**
 * Build a normalized wishlist item from a backend product object.
 * Exported as BOTH default and named export for compatibility.
 */
function buildWishlistItemFromProduct({
  product,
  variantId = null,
  notes = null,
  mediaBase = DEFAULT_MEDIA_BASE,
} = {}) {
  if (!product) return null;

  const variants = Array.isArray(product.variants) ? product.variants : [];
  const chosenVariant =
    variants.find((v) => String(v.id) === String(variantId)) ||
    variants[0] ||
    null;

  const price =
    chosenVariant?.price ??
    chosenVariant?.base_price ??
    product.price ??
    product.base_price ??
    0;

  const images = Array.isArray(product.images)
    ? product.images
    : product.primary_image
    ? [{ image_path: product.primary_image }]
    : product.image
    ? [{ image_path: product.image }]
    : [];

  const firstImage =
    normalizeImage(
      images[0] || product.image || product.primary_image,
      mediaBase
    ) || null;

  return {
    id: product.id,
    productId: product.id,
    variantId: chosenVariant?.id ?? null,
    name: product.name,
    sku: chosenVariant?.sku ?? product.sku ?? null,
    price: Number(price) || 0,
    images,
    image: firstImage,
    vendorId: product?.vendor?.id ?? null,
    vendorName: product?.vendor?.shop_name ?? product?.vendor?.name ?? null,
    notes,
    rawProduct: product,
  };
}

export default buildWishlistItemFromProduct;
export { buildWishlistItemFromProduct };
