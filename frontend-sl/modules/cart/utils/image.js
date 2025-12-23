// modules/cart/utils/image.js

const DEFAULT_MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_BASE || "http://localhost:8000";

/**
 * Normalize image (string path or object) to an absolute URL where possible.
 * Named export: normalizeImage
 */
export function normalizeImage(img, mediaBase = DEFAULT_MEDIA_BASE) {
  if (!img) return null;

  // If string and already absolute
  if (typeof img === "string") {
    if (/^https?:\/\//i.test(img)) return img;
    // treat as storage relative path
    return `${mediaBase.replace(/\/$/, "")}/storage/${String(img).replace(
      /^\/+/,
      ""
    )}`;
  }

  // If object, prefer src/url/image_path
  if (typeof img === "object") {
    if (img.src) return img.src;
    if (img.url) return img.url;
    if (img.image_path) {
      return `${mediaBase.replace(/\/$/, "")}/storage/${String(
        img.image_path
      ).replace(/^\/+/, "")}`;
    }
  }

  return null;
}

/**
 * Get first reasonable image value from product/item.
 * Named export: getImageSrc
 */
export function getImageSrc(itemOrImages, mediaBase = DEFAULT_MEDIA_BASE) {
  if (!itemOrImages) return "/images/placeholder.png";

  // if passed an array (product.images)
  if (Array.isArray(itemOrImages) && itemOrImages.length > 0) {
    return (
      normalizeImage(itemOrImages[0], mediaBase) || "/images/placeholder.png"
    );
  }

  // if passed a single image or object
  if (typeof itemOrImages === "string" || typeof itemOrImages === "object") {
    return normalizeImage(itemOrImages, mediaBase) || "/images/placeholder.png";
  }

  return "/images/placeholder.png";
}
