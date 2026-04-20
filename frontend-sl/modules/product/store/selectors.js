// modules/product/store/selectors.js

export const selectAllProducts = (state, mode = "all") => {
  if (mode === "vendor") {
    const ids = state.products.vendorList || [];
    const items = state.products.vendorItemsById || {};
    return ids.map((id) => items[id]);
  }

  const ids = state.products.list || [];
  const items = state.products.itemsById || {};
  return ids.map((id) => items[id]);
};

export const selectProductBySlug = (state, slug) => {
  if (!slug) return null;
  const id = state.products.slugMap?.[slug];
  if (!id) return null;
  return state.products.itemsById?.[id] || null;
};

const getValue = (field) => {
  if (!field) return null;
  if (typeof field === "string") return field;
  if (typeof field === "object") return field.slug || field.name || null;
  return null;
};

export const selectProductsByChild = (state, childSlug, mode = "all") => {
  if (!childSlug) return [];

  const all = selectAllProducts(state, mode);
  const target = String(childSlug).toLowerCase();

  return all.filter((p) => {
    const val =
      getValue(p.child_category) ||
      getValue(p.childCategory) ||
      p.childCategorySlug;

    return val && val.toLowerCase() === target;
  });
};
