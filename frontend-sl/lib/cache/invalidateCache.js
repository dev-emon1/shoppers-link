export const invalidateOrdersCache = () => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem("orders_list");
  }
};

export const invalidateCache = (key) => {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(`sl:home:${key}`);
  }
};

export const invalidateAllHomeCache = () => {
  const keys = ["featured", "newArrivals", "topRating", "topSelling"];

  keys.forEach((k) => {
    sessionStorage.removeItem(`sl:home:${k}`);
  });
};
