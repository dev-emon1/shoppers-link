const KEY = "recent_searches";

export const getRecentSearches = () => {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(KEY)) || [];
};

export const addRecentSearch = (q) => {
  if (!q) return;
  const list = getRecentSearches();
  const updated = [q, ...list.filter((i) => i !== q)].slice(0, 5);
  localStorage.setItem(KEY, JSON.stringify(updated));
};
