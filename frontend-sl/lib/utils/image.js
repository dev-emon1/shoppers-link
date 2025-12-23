// lib/utils/image.js
export function makeImageUrl(path) {
  if (!path) return "/placeholder-product.png";
  if (typeof path !== "string") return "/placeholder-product.png";

  // already an absolute url
  if (/^https?:\/\//i.test(path)) return path;

  const envBase =
    process.env.NEXT_PUBLIC_API_IMAGE_URL ||
    process.env.NEXT_PUBLIC_MEDIA_BASE ||
    "";
  const base = String(envBase).replace(/\/+$/, ""); // remove trailing slash(es)

  let p = path.replace(/^\/+/, ""); // drop leading slashes

  // if base ends with '/storage' and path starts with 'storage/', remove that leading 'storage/'
  if (/\/storage$/i.test(base) && /^storage\//i.test(p)) {
    p = p.replace(/^storage\//i, "");
  }

  // collapse multiple leading 'storage/' to single 'storage/'
  p = p.replace(/^(storage\/)+/i, "storage/");

  if (base) return `${base}/${p}`;
  return `/${p}`;
}
