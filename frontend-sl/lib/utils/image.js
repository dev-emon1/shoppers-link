// lib/utils/image.js

const KNOWN_FOLDERS = [
  "avatars",
  "banners",
  "categories",
  "childCategories",
  "probanners",
  "product_images",
  "reviews",
  "subCategories",
  "vendors",
];

export function makeImageUrl(path) {
  if (!path || typeof path !== "string") {
    return "/placeholder-user.png";
  }

  // already absolute
  if (/^https?:\/\//i.test(path)) return path;

  const base =
    process.env.NEXT_PUBLIC_API_IMAGE_URL ||
    process.env.NEXT_PUBLIC_MEDIA_BASE ||
    "";

  const cleanBase = String(base).replace(/\/+$/, "");
  let p = path.replace(/^\/+/, "");

  // if path already contains a known folder, respect it
  const hasKnownFolder = KNOWN_FOLDERS.some((folder) =>
    p.startsWith(folder + "/"),
  );

  if (!hasKnownFolder) {
    /**
     * 🧠 Smart default rules
     * - user/customer images → avatars
     * - product images usually already come prefixed
     */
    p = `avatars/${p}`;
  }

  // ensure storage prefix
  if (!p.startsWith("storage/")) {
    p = `storage/${p}`;
  }

  return cleanBase ? `${cleanBase}/${p}` : `/${p}`;
}

/**
 * Convert external image URL to base64 (for html2canvas PDF)
 * This is ONLY for invoice generation to avoid CORS/tainting issues
 */
export const getImageAsBase64 = async (imagePathOrUrl) => {
  if (!imagePathOrUrl) return null;

  const fullUrl = makeImageUrl(imagePathOrUrl);
  console.log("Trying to load image:", fullUrl); // Debug

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.timeout = 10000; // 10 seconds timeout

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth || img.width || 200;
        canvas.height = img.naturalHeight || img.height || 200;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const dataUrl = canvas.toDataURL("image/png", 0.85);
        console.log(
          "Base64 conversion successful for:",
          fullUrl.substring(0, 100) + "...",
        );
        resolve(dataUrl);
      } catch (err) {
        console.error("Canvas error for image:", fullUrl, err);
        resolve(null);
      }
    };

    img.onerror = (err) => {
      console.error("Image load failed for:", fullUrl, err);
      resolve(null);
    };

    // Force load
    img.src = fullUrl + (fullUrl.includes("?") ? "&t=" : "?t=") + Date.now();
  });
};
