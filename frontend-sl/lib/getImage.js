export const getImage = (img) => {
  if (!img) return "/images/placeholder.png";

  // Imported Next.js image module
  if (typeof img === "object" && img?.src) return img.src;

  // Plain string image path
  if (typeof img === "string") return img;

  return "/images/placeholder.png";
};
