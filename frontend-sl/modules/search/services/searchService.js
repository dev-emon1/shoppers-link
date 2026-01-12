import api from "@/core/api/axiosClient";
import { readSearchCache, writeSearchCache } from "../utils/searchCache";

export async function searchProductsApi({
  q = "",
  categoryId = null,
  limit = null,
  signal,
}) {
  // ❗ only block when BOTH missing
  if (!q && !categoryId) {
    return { items: [], total: 0 };
  }

  /* -----------------------
     CACHE (FULL RESULT ONLY)
  ------------------------ */
  if (!limit) {
    const cached = readSearchCache({ q, categoryId });
    if (cached) return cached;
  }

  /* -----------------------
     NETWORK REQUEST
  ------------------------ */
  const params = new URLSearchParams();
  if (q) params.append("search", q);
  if (categoryId) params.append("category_id", categoryId);
  if (limit) params.append("limit", limit);

  const response = await api.get(`/allProducts?${params.toString()}`, {
    signal,
  });

  const result = {
    items: response.data?.data ?? [],
    total:
      response.data?.total ??
      response.data?.meta?.total ??
      response.data?.data?.length ??
      0,
  };

  /* -----------------------
     SAVE CACHE (FULL ONLY)
  ------------------------ */
  if (!limit) {
    writeSearchCache({ q, categoryId }, result);
  }

  return result;
}
