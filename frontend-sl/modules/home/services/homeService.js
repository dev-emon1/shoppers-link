import api from "@/core/api/axiosClient";

/**
 * Banners API
 */
export const fetchBannersApi = async () => {
  const res = await api.get("/active/banners");
  return Array.isArray(res?.data?.data) ? res.data.data : [];
};

/**
 * Featured Products API
 */
export const fetchFeaturedProductsApi = async () => {
  const res = await api.get("/featured-products");
  return Array.isArray(res?.data?.data) ? res.data.data : [];
};

/**
 * New Arrivals Products API
 */
export const fetchNewArrivalsApi = async () => {
  const res = await api.get("/new/arrivals");
  return Array.isArray(res?.data?.data) ? res.data.data : [];
};

/**
 * Top Selling Products API
 */
export const fetchTopSellingApi = async () => {
  const res = await api.get("/top/selling");
  return Array.isArray(res?.data?.data) ? res.data.data : [];
};

/**
 * Top Rating Products API
 */
export const fetchTopRatingApi = async () => {
  const res = await api.get("/top/ratting");
  return Array.isArray(res?.data?.data) ? res.data.data : [];
};
