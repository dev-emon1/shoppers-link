// modules/product/store/selectors.js
export const selectAllProducts = (state) => {
  const ids = state.products.list || [];
  const itemsById = state.products.itemsById || {};
  return ids.map((id) => itemsById[id]);
};

export const selectProductBySlug = (state, slug) => {
  if (!slug) return null;
  const id = state.products.slugMap?.[slug];
  if (!id) return null;
  return state.products.itemsById?.[id] || null;
};

/**
 * UPDATED selectProductsByChild
 * supports multiple backend shapes:
 *  - flat p.childCategorySlug
 *  - flat p.childCategory
 *  - nested p.child_category.slug
 *  - nested p.child_category.name
 *  - case-insensitive comparison
 */
export const selectProductsByChild = (state, childSlug) => {
  if (!childSlug) return [];
  const all = selectAllProducts(state);
  const target = String(childSlug);

  return all.filter((p) => {
    if (!p) return false;

    // 1) flat slug field (childCategorySlug)
    if (p.childCategorySlug && p.childCategorySlug === target) return true;

    // 2) flat label field (childCategory)
    if (p.childCategory && p.childCategory === target) return true;

    // 3) snake_case field
    if (p.child_category && p.child_category === target) return true;

    // 4) nested object: p.child_category.slug
    if (p.child_category && typeof p.child_category === "object") {
      if (p.child_category.slug && p.child_category.slug === target)
        return true;
      if (p.child_category.name && p.child_category.name === target)
        return true;
    }

    // 5) nested via sub_category -> child inside (some APIs): p.sub_category.child_category?
    // try p.sub_category && p.sub_category.slug (unlikely) but safe
    if (p.sub_category && typeof p.sub_category === "object") {
      if (p.sub_category.slug && p.sub_category.slug === target) return true;
      if (p.sub_category.name && p.sub_category.name === target) return true;
    }

    // 6) nested canonical path: p.category.slug + p.sub_category.slug + p.child_category.slug
    // check case-insensitive equality for labels
    const targetLower = target.toLowerCase();

    if (
      p.child_category &&
      p.child_category.name &&
      p.child_category.name.toLowerCase() === targetLower
    )
      return true;
    if (p.childCategory && p.childCategory.toLowerCase() === targetLower)
      return true;
    if (
      p.childCategorySlug &&
      p.childCategorySlug.toLowerCase() === targetLower
    )
      return true;
    if (
      p.child_category &&
      p.child_category.slug &&
      p.child_category.slug.toLowerCase() === targetLower
    )
      return true;

    // 7) conservative contains fallback: check if label contains words from slug (replace hyphen)
    const targetAsLabel = target.replace(/-/g, " ").toLowerCase();
    if (
      p.child_category &&
      p.child_category.name &&
      p.child_category.name.toLowerCase().includes(targetAsLabel)
    )
      return true;
    if (
      p.childCategory &&
      p.childCategory.toLowerCase().includes(targetAsLabel)
    )
      return true;

    return false;
  });
};
