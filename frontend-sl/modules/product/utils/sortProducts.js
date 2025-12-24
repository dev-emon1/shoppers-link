export function sortProducts(products = [], sort) {
  const list = [...products]; // important: clone

  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => {
        const pa = Number(a.price || a.base_price || 0);
        const pb = Number(b.price || b.base_price || 0);
        return pa - pb;
      });

    case "price-desc":
      return list.sort((a, b) => {
        const pa = Number(a.price || a.base_price || 0);
        const pb = Number(b.price || b.base_price || 0);
        return pb - pa;
      });

    case "rating":
      return list.sort(
        (a, b) =>
          Number(b.avg_rating || b.rating || 0) -
          Number(a.avg_rating || a.rating || 0)
      );

    case "newest":
    default:
      return list.sort(
        (a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)
      );
  }
}
