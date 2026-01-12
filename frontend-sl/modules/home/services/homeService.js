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
export const fetchFeaturedProductsApi = async (page = 1) => {
  const res = await api.get(`/featured-products?page=${page}`);
  return res?.data; // { data, meta }
};

/**
 * Banners API
 */
export const fetchPromoBannersApi = async () => {
  const res = await api.get("/active/banners");
  return Array.isArray(res?.data?.data) ? res.data.data : [];
};

/**
 * New Arrivals Products API
 */
export const fetchNewArrivalsApi = async (page = 1) => {
  const res = await api.get(`/new/arrivals?page=${page}`);
  return res?.data;
};

/**
 * Top Selling Products API
 */
export const fetchTopSellingApi = async (page = 1) => {
  const res = await api.get(`/top/selling?page=${page}`);
  return res?.data;
};

/**
 * Top Rating Products API
 */
export const fetchTopRatingApi = async (page = 1) => {
  const res = await api.get(`/top/ratting?page=${page}`);
  return res?.data;
};

/**
 * Shop By Brand (Vendor Shops) API
 */
export const fetchShopByBrandsApi = async (page = 1) => {
  const res = await api.get(`/vendor/shops?page=${page}`);
  return res?.data;
};
