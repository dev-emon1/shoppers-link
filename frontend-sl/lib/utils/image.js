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
    p.startsWith(folder + "/")
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
