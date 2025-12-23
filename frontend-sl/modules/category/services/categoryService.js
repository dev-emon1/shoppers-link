// frontend_v1/modules/category/services/categoryService.js
import api from "@/core/api/axiosClient";

const CACHE_KEY = "shopperslink:categories:raw:v1";
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.ts || parsed.data === undefined) return null;
    return parsed;
  } catch (e) {
    return null;
  }
}

function writeCache(data) {
  try {
    const payload = { ts: Date.now(), data };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch (e) {
    console.warn("categories cache write failed:", e?.message || e);
  }
}

function isFresh(cached, ttl = CACHE_TTL_MS) {
  if (!cached || !cached.ts) return false;
  return Date.now() - cached.ts < ttl;
}

export const fetchAllCategories = async ({ cacheTTL = CACHE_TTL_MS } = {}) => {
  const cached = readCache();

  if (cached && isFresh(cached, cacheTTL)) {
    return cached.data;
  }

  if (cached && !isFresh(cached, cacheTTL)) {
    refreshCategoriesInBackground(cacheTTL);
    return cached.data;
  }

  try {
    const res = await api.get("/allcategories");
    const payload = res?.data?.data ?? res?.data ?? [];
    writeCache(payload);
    return payload;
  } catch (err) {
    console.error("fetchAllCategories network error:", err?.message ?? err);
    if (cached && Array.isArray(cached.data)) return cached.data;
    return [];
  }
};

async function refreshCategoriesInBackground(cacheTTL = CACHE_TTL_MS) {
  try {
    const res = await api.get("/allcategories");
    const payload = res?.data?.data ?? res?.data ?? [];
    writeCache(payload);
    try {
      window.dispatchEvent(
        new CustomEvent("shopperslink:categories:updated", {
          detail: { ts: Date.now() },
        })
      );
    } catch (e) {}
    return payload;
  } catch (e) {
    console.warn("background categories refresh failed:", e?.message ?? e);
    return null;
  }
}

export async function forceRefreshCategories() {
  try {
    const res = await api.get("/allcategories");
    const payload = res?.data?.data ?? res?.data ?? [];
    writeCache(payload);
    return payload;
  } catch (e) {
    console.error("forceRefreshCategories error:", e?.message ?? e);
    return null;
  }
}
