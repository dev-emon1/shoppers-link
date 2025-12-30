const PREFIX = "sl_cache_";

export const setSessionTTL = (key, data, ttlSeconds = 120) => {
  const payload = {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000,
  };
  sessionStorage.setItem(PREFIX + key, JSON.stringify(payload));
};

export const getSessionTTL = (key) => {
  try {
    const raw = sessionStorage.getItem(PREFIX + key);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (Date.now() > parsed.expiresAt) {
      sessionStorage.removeItem(PREFIX + key);
      return null;
    }
    return parsed.data;
  } catch {
    return null;
  }
};

export const clearSessionTTL = (key) => {
  sessionStorage.removeItem(PREFIX + key);
};
