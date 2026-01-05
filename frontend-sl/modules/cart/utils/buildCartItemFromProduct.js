import { normalizeImage } from "./image";
import { toNumber } from "./utils";
import { selectNextSellableVariant } from "./selectNextSellableVariant";

const DEFAULT_MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_BASE || "http://localhost:8000";

function buildCartItemFromProduct({
  product,
  variantId = null,
  quantity = 1,
  vendorId = null,
  vendorName = null,
  mediaBase = DEFAULT_MEDIA_BASE,
  cartItems = [],
} = {}) {
  if (!product) return null;

  const variants = Array.isArray(product.variants) ? product.variants : [];

  // ✅ FIX: define usedVariantIds
  const usedVariantIds = cartItems
    .filter((i) => String(i.productId) === String(product.id))
    .map((i) => String(i.variantId));

  const chosenVariant = selectNextSellableVariant({
    variants,
    preferredVariantId: variantId,
    usedVariantIds,
  });

  const price =
    chosenVariant?.price ??
    chosenVariant?.base_price ??
    product.price ??
    product.base_price ??
    0;

  const stock = chosenVariant ? Number(chosenVariant.stock) : 0;

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

  return {
    id: product.id,
    productId: product.id,
    variantId: chosenVariant?.id ?? null,
    name: product.name,
    sku: chosenVariant?.sku ?? product.sku ?? null,
    price: Number(price) || 0,
    stock,
    quantity: Number(quantity) || 1,
    images,
    image: firstImageUrl,
    vendorId: vendorId ?? product?.vendor?.id ?? null,
    vendorName:
      vendorName ?? product?.vendor?.shop_name ?? product?.vendor?.name ?? null,
    rawProduct: product,
  };
}

export default buildCartItemFromProduct;
export { buildCartItemFromProduct };
