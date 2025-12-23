// modules/search/services/searchService.js
import api from "@/core/api/axiosClient";

/**
 * Search products via backend endpoint /allProducts
 * Backend expects query param `search` (per your Laravel controller)
 */
export async function searchProductsApi({ q = "", signal = null } = {}) {
  try {
    const paramName = "search"; // backend expects 'search'
    const url = `/allProducts${
      q ? `?${paramName}=${encodeURIComponent(q)}` : ""
    }`;

    // If you have axios client
    if (api && typeof api.get === "function") {
      const res = await api.get(url, { signal });
      const payload = res?.data?.data ?? res?.data ?? res;
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload?.products)) return payload.products;
      // sometimes backend returns paginated structure
      if (payload?.data && Array.isArray(payload.data)) return payload.data;
      return [];
    }

    // fallback fetch
    const resp = await fetch(url, { signal });
    if (!resp.ok) throw new Error("Network error");
    const j = await resp.json();
    const payload = j?.data ?? j;
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload?.products)) return payload.products;
    if (payload?.data && Array.isArray(payload.data)) return payload.data;
    return [];
  } catch (err) {
    throw err;
  }
}
