// modules/wishlist/utils/image.js

const DEFAULT_MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_BASE || "http://localhost:8000";

export function normalizeImage(img, mediaBase = DEFAULT_MEDIA_BASE) {
  if (!img) return null;

  if (typeof img === "string") {
    if (/^https?:\/\//i.test(img)) return img;
    // assume backend returns "product_images/xxx.jpg"
    return `${mediaBase.replace(/\/$/, "")}/storage/${String(img).replace(
      /^\/+/,
      ""
    )}`;
  }

  if (typeof img === "object") {
    if (img.src) return img.src;
    if (img.url) return img.url;
    if (img.image_path)
      return `${mediaBase.replace(/\/$/, "")}/storage/${String(
        img.image_path
      ).replace(/^\/+/, "")}`;
  }

  return null;
}

export function getImageSrc(itemOrImages, mediaBase = DEFAULT_MEDIA_BASE) {
  if (!itemOrImages) return "/images/placeholder.png";

  if (Array.isArray(itemOrImages) && itemOrImages.length > 0) {
    const url = normalizeImage(itemOrImages[0], mediaBase);
    return url || "/images/placeholder.png";
  }

  const url = normalizeImage(itemOrImages, mediaBase);
  return url || "/images/placeholder.png";
}
