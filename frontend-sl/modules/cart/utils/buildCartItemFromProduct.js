import { normalizeImage } from "./image";
import { selectNextSellableVariant } from "./selectNextSellableVariant";

const DEFAULT_MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_BASE || "http://localhost:8000";

/* ----------------------------------
   Resolve variant specific image
---------------------------------- */
function getVariantImage({ product, variant, mediaBase }) {
  if (!product || !variant) return null;

  // 🔥 Always parse attributes safely
  let attrs = {};
  try {
    attrs =
      typeof variant.attributes === "string"
        ? JSON.parse(variant.attributes)
        : variant.attributes || {};
  } catch {
    attrs = {};
  }

  const variantColor = attrs?.Color
    ? String(attrs.Color).toLowerCase()
    : null;

  if (!variantColor) {
    // fallback immediately if no color
    return (
      (product.primary_image &&
        normalizeImage(product.primary_image, mediaBase)) ||
      (product.image && normalizeImage(product.image, mediaBase)) ||
      null
    );
  }

  // 1️⃣ Try matching image by COLOR
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

        return (
          String(vAttrs?.Color || "").toLowerCase() === variantColor
        );
      } catch {
        return false;
      }
    });

    if (matched?.image_path) {
      return normalizeImage(matched.image_path, mediaBase);
    }
  }

  // 2️⃣ fallback to primary
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

  const variants = Array.isArray(product.variants)
    ? product.variants
    : [];

  // Used variants for rotation support
  const usedVariantIds = cartItems
    .filter((i) => String(i.productId) === String(product.id))
    .map((i) => String(i.variantId));

  /* ----------------------------------
     STRICT VARIANT SELECTION
     (Never override user choice unless out of stock)
  ---------------------------------- */
  let chosenVariant = null;

  if (variantId) {
    chosenVariant = variants.find(
      (v) => String(v.id) === String(variantId)
    );
  }

  // If no variant or out of stock → auto pick next sellable
  if (!chosenVariant || Number(chosenVariant.stock) <= 0) {
    chosenVariant = selectNextSellableVariant({
      variants,
      preferredVariantId: null,
      usedVariantIds,
    });
  }

  /* ----------------------------------
     PRICE & STOCK
  ---------------------------------- */
  const price =
    chosenVariant?.price ??
    chosenVariant?.base_price ??
    product.price ??
    product.base_price ??
    0;

  const stock = chosenVariant
    ? Number(chosenVariant.stock)
    : Number(product.stock) || 0;

  /* ----------------------------------
     VARIANT ATTRIBUTES SNAPSHOT
  ---------------------------------- */
  let variantAttributes = {};
  try {
    variantAttributes =
      typeof chosenVariant?.attributes === "string"
        ? JSON.parse(chosenVariant.attributes)
        : chosenVariant?.attributes || {};
  } catch {
    variantAttributes = {};
  }

  /* ----------------------------------
     IMAGE SNAPSHOT
  ---------------------------------- */
  const image = getVariantImage({
    product,
    variant: chosenVariant,
    mediaBase,
  });

  /* ----------------------------------
     FINAL CART OBJECT
  ---------------------------------- */
  return {
    // 🔥 Unique cart row ID (prevents merge issues)
    id: `${product.id}-${chosenVariant?.id ?? "base"}`,

    productId: product.id,
    variantId: chosenVariant?.id ?? null,

    name: product.name,

    sku: chosenVariant?.sku ?? product.sku ?? null,

    // 🔥 Important: enables showing Color, Size, etc in cart
    variantAttributes,

    price: Number(price) || 0,
    stock,
    quantity: Number(quantity) || 1,

    image,

    vendorId:
      vendorId ?? product?.vendor?.id ?? null,

    vendorName:
      vendorName ??
      product?.vendor?.shop_name ??
      product?.vendor?.name ??
      null,

    // Keep raw product if needed
    rawProduct: product,
  };
}

export default buildCartItemFromProduct;
export { buildCartItemFromProduct };