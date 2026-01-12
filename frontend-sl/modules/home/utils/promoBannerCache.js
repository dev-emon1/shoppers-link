const KEY_PREFIX = "shopperslink:promo-banner:";
const TTL = 10 * 60 * 1000; // 10 minutes

export function readPromoBanner(position) {
  try {
    const raw = sessionStorage.getItem(KEY_PREFIX + position);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    if (!parsed.ts || !parsed.data) return null;

    if (Date.now() - parsed.ts > TTL) return null;

    return parsed.data;
  } catch {
    return null;
  }
}

export function writePromoBanner(position, data) {
  try {
    sessionStorage.setItem(
      KEY_PREFIX + position,
      JSON.stringify({ ts: Date.now(), data })
    );
  } catch {}
}
