const PREFIX = "sl:home:";

export const readProductCache = (key) => {
  try {
    const raw = sessionStorage.getItem(PREFIX + key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const writeProductCache = (key, payload) => {
  try {
    sessionStorage.setItem(PREFIX + key, JSON.stringify(payload));
  } catch {}
};
