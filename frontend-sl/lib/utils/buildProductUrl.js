export function buildProductUrl(product) {
  const category = product.category?.slug;
  const sub = product.sub_category?.slug;
  const child = product.child_category?.slug;
  const slug = product.slug;

  if (!category || !sub || !child || !slug) return "#";

  return `/${category}/${sub}/${child}/${slug}`;
}
