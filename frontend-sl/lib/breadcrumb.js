// lib/breadcrumb.js

/**
 * makeCrumbs
 * - Build crumbs when you already have objects (cat/sub/child/product)
 * - Falls back to slug strings if object not present
 */
export const makeCrumbs = ({
  cat,
  sub,
  child,
  product,
  customTrail = [],
} = {}) => {
  const crumbs = [{ label: "Home", href: "/" }];

  if (cat) {
    const catSlug = typeof cat === "string" ? cat : cat?.slug;
    const catLabel = typeof cat === "string" ? cat : cat?.name || catSlug;
    if (catSlug) crumbs.push({ label: catLabel, href: `/${catSlug}` });
  }

  if (sub) {
    const subSlug = typeof sub === "string" ? sub : sub?.slug;
    const subLabel = typeof sub === "string" ? sub : sub?.name || subSlug;
    const catSlug = typeof cat === "string" ? cat : cat?.slug;
    if (subSlug && catSlug)
      crumbs.push({ label: subLabel, href: `/${catSlug}/${subSlug}` });
  }

  if (child) {
    const childSlug = typeof child === "string" ? child : child?.slug;
    const childLabel =
      typeof child === "string" ? child : child?.name || childSlug;
    const catSlug = typeof cat === "string" ? cat : cat?.slug;
    const subSlug = typeof sub === "string" ? sub : sub?.slug;
    if (childSlug && catSlug && subSlug)
      crumbs.push({
        label: childLabel,
        href: `/${catSlug}/${subSlug}/${childSlug}`,
      });
  }

  if (product) {
    const pSlug = typeof product === "string" ? product : product?.slug;
    const pLabel =
      typeof product === "string" ? product : product?.name || pSlug;
    const catSlug = typeof cat === "string" ? cat : cat?.slug;
    const subSlug = typeof sub === "string" ? sub : sub?.slug;
    const childSlug = typeof child === "string" ? child : child?.slug;
    if (pSlug && catSlug)
      crumbs.push({
        label: pLabel,
        href: `/${catSlug}${subSlug ? `/${subSlug}` : ""}${
          childSlug ? `/${childSlug}` : ""
        }/${pSlug}`,
      });
  }

  if (Array.isArray(customTrail) && customTrail.length)
    crumbs.push(...customTrail);
  return crumbs;
};

/**
 * makeCrumbsFromSlug
 * - Accepts slug array and optional finders object { getCategoryBySlug, getSubcategoryBySlug, getChildBySlug, getProductBySlug }
 * - If finders provided, uses names from objects; otherwise falls back to raw slugs
 */
export const makeCrumbsFromSlug = (slugArray = [], finders = {}) => {
  if (!Array.isArray(slugArray)) return [];
  const crumbs = [{ label: "Home", href: "/" }];
  const [catSlug, subSlug, childSlug, productSlug] = slugArray;

  const {
    getCategoryBySlug,
    getSubcategoryBySlug,
    getChildBySlug,
    getProductBySlug,
  } = finders || {};

  if (catSlug) {
    if (typeof getCategoryBySlug === "function") {
      const cat = getCategoryBySlug(catSlug);
      crumbs.push({ label: cat?.name || catSlug, href: `/${catSlug}` });
    } else {
      crumbs.push({ label: catSlug, href: `/${catSlug}` });
    }
  }

  if (catSlug && subSlug) {
    if (typeof getSubcategoryBySlug === "function") {
      const sub = getSubcategoryBySlug(catSlug, subSlug);
      crumbs.push({
        label: sub?.name || subSlug,
        href: `/${catSlug}/${subSlug}`,
      });
    } else {
      crumbs.push({ label: subSlug, href: `/${catSlug}/${subSlug}` });
    }
  }

  if (catSlug && subSlug && childSlug) {
    if (typeof getChildBySlug === "function") {
      const child = getChildBySlug(catSlug, subSlug, childSlug);
      crumbs.push({
        label: child?.name || childSlug,
        href: `/${catSlug}/${subSlug}/${childSlug}`,
      });
    } else {
      crumbs.push({
        label: childSlug,
        href: `/${catSlug}/${subSlug}/${childSlug}`,
      });
    }
  }

  if (productSlug) {
    if (typeof getProductBySlug === "function") {
      const product = getProductBySlug(productSlug);
      crumbs.push({
        label: product?.name || productSlug,
        href: `/${catSlug || ""}${subSlug ? `/${subSlug}` : ""}${
          childSlug ? `/${childSlug}` : ""
        }/${product?.slug || productSlug}`,
      });
    } else {
      crumbs.push({
        label: productSlug,
        href: `/${catSlug || ""}${subSlug ? `/${subSlug}` : ""}${
          childSlug ? `/${childSlug}` : ""
        }/${productSlug}`,
      });
    }
  }

  return crumbs;
};
