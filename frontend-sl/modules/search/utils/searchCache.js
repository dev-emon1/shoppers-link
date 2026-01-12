const CACHE_PREFIX = "shopperslink:search:";
const CACHE_TTL = 2 * 60 * 1000; // 2 minutes

function getCacheKey({ q, categoryId }) {
  return `${CACHE_PREFIX}${q || "all"}:${categoryId || "all"}`;
}

export function readSearchCache({ q, categoryId }) {
  try {
    const key = getCacheKey({ q, categoryId });
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed.ts || !parsed.data) return null;

    if (Date.now() - parsed.ts > CACHE_TTL) return null;

    return parsed.data;
  } catch {
    return null;
  }
}

export function writeSearchCache({ q, categoryId }, data) {
  try {
    const key = getCacheKey({ q, categoryId });
    sessionStorage.setItem(
      key,
      JSON.stringify({
        ts: Date.now(),
        data,
      })
    );
  } catch {}
}
