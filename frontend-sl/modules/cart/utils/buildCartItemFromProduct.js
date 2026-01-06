import { normalizeImage } from "./image";
import { selectNextSellableVariant } from "./selectNextSellableVariant";

const DEFAULT_MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_BASE || "http://localhost:8000";

/* ----------------------------------
   Resolve variant specific image
---------------------------------- */
function getVariantImage({ product, variant, mediaBase }) {
  if (!product || !variant) return null;

  // 🔥 ALWAYS parse attributes
  let attrs = {};
  try {
    attrs =
      typeof variant.attributes === "string"
        ? JSON.parse(variant.attributes)
        : variant.attributes || {};
  } catch {
    attrs = {};
  }

  const variantColor = attrs?.Color ? String(attrs.Color).toLowerCase() : null;

  if (!variantColor) return null;

  // 1️⃣ Find image by COLOR (not variant id)
  if (Array.isArray(product.images)) {
    const matched = product.images.find((img) => {
      if (!img.variant_id) return false;

      const v = product.variants?.find(
        (x) => String(x.id) === String(img.variant_id)
      );
      if (!v) return false;

      try {
        const vAttrs =
          typeof v.attributes === "string"
            ? JSON.parse(v.attributes)
            : v.attributes || {};

        return String(vAttrs?.Color || "").toLowerCase() === variantColor;
      } catch {
        return false;
      }
    });

    if (matched?.image_path) {
      return normalizeImage(matched.image_path, mediaBase);
    }
  }

  // 2️⃣ fallback
  if (product.primary_image) {
    return normalizeImage(product.primary_image, mediaBase);
  }

  if (product.image) {
    return normalizeImage(product.image, mediaBase);
  }

  return null;
}

/* ----------------------------------
   Build Cart Item (FINAL)
---------------------------------- */
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

  // used variants (rotation support)
  const usedVariantIds = cartItems
    .filter((i) => String(i.productId) === String(product.id))
    .map((i) => String(i.variantId));

  /* ----------------------------------
     ✅ STRICT variant selection
     (never override user choice)
  ---------------------------------- */
  let chosenVariant = null;

  if (variantId) {
    chosenVariant = variants.find((v) => String(v.id) === String(variantId));
  }

  if (!chosenVariant || Number(chosenVariant.stock) <= 0) {
    chosenVariant = selectNextSellableVariant({
      variants,
      preferredVariantId: null,
      usedVariantIds,
    });
  }

  const price =
    chosenVariant?.price ??
    chosenVariant?.base_price ??
    product.price ??
    product.base_price ??
    0;

  const stock = chosenVariant ? Number(chosenVariant.stock) : 0;

  // FINAL IMAGE SNAPSHOT
  const image = getVariantImage({
    product,
    variant: chosenVariant,
    mediaBase,
  });

  /* ----------------------------------
     FINAL RETURN (THIS IS IMPORTANT)
  ---------------------------------- */
  return {
    id: product.id,
    productId: product.id,
    variantId: chosenVariant?.id ?? null,

    name: product.name,
    sku: chosenVariant?.sku ?? product.sku ?? null,

    price: Number(price) || 0,
    stock,
    quantity: Number(quantity) || 1,

    // 🔥 cart will ALWAYS use this
    image,
    // images: image ? [image] : [],

    vendorId: vendorId ?? product?.vendor?.id ?? null,
    vendorName:
      vendorName ?? product?.vendor?.shop_name ?? product?.vendor?.name ?? null,

    rawProduct: product,
  };
}

export default buildCartItemFromProduct;
export { buildCartItemFromProduct };
