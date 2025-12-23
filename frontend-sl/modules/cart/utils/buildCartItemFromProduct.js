// modules/cart/utils/buildCartItemFromProduct.js

import { normalizeImage } from "./image";
import { toNumber } from "./utils";

const DEFAULT_MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_BASE || "http://localhost:8000";

/**
 * Build a normalized cart item object from backend product payload.
 * - Default export for backward compatibility: import buildCartItemFromProduct from '...'
 * - Also provide named export at bottom for optional named imports.
 */
function buildCartItemFromProduct({
  product,
  variantId = null,
  quantity = 1,
  vendorId = null,
  vendorName = null,
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

  const stock = chosenVariant?.stock ?? product.stock ?? 0;

  // normalize images array: keep original array if present
  const images = Array.isArray(product.images)
    ? product.images
    : product.primary_image
    ? [{ image_path: product.primary_image }]
    : product.image
    ? [{ image_path: product.image }]
    : [];

  const firstImageUrl =
    normalizeImage(
      images[0] || product.image || product.primary_image,
      mediaBase
    ) || null;

  const item = {
    // minimal required fields (match your reducers)
    id: product.id,
    productId: product.id,
    variantId: chosenVariant?.id ?? null,
    name: product.name,
    sku: chosenVariant?.sku ?? product.sku ?? null,
    price: Number(price) || 0,
    stock: Number(stock) || 0,
    quantity: Number(quantity) || 1,
    images,
    image: firstImageUrl,
    vendorId: vendorId ?? product?.vendor?.id ?? null,
    vendorName:
      vendorName ?? product?.vendor?.shop_name ?? product?.vendor?.name ?? null,
    rawProduct: product,
  };

  return item;
}

export default buildCartItemFromProduct;
export { buildCartItemFromProduct };
