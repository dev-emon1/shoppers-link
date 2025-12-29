// modules/search/services/searchService.js
import api from "@/core/api/axiosClient";

/**
 * Search products
 * @param {Object} params
 * @param {string} params.q - search keyword
 * @param {number|null} params.categoryId
 * @param {number} params.limit
 * @param {AbortSignal} params.signal
 */
export async function searchProductsApi({
  q = "",
  categoryId = null,
  limit = null,
  signal,
}) {
  if (!q) return { items: [], total: 0 };

  const params = new URLSearchParams();

  params.append("search", q);

  if (categoryId) {
    params.append("category_id", categoryId);
  }

  if (limit) {
    params.append("limit", limit);
  }

  const response = await api.get(`/allProducts?${params.toString()}`, {
    signal,
  });

  /**
   * Expected backend response
   * {
   *   data: [...],
   *   total: number
   * }
   */
  return {
    items: response.data?.data ?? [],
    total:
      response.data?.total ??
      response.data?.meta?.total ??
      response.data?.data?.length ??
      0,
  };
}
