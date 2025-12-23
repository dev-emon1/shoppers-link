import api from "@/core/api/axiosClient";

export const productServiceApi = async () => {
  try {
    const res = await api.get("/allProducts");
    if (res && res.data) return res.data;
    return data;
  } catch (error) {
    console.error(error);
  }
};

export async function fetchProductsFromApi(params = {}) {
  const res = await api.get("/allProducts", { params });
  const payload = Array.isArray(res?.data?.data)
    ? res.data.data
    : Array.isArray(res?.data)
    ? res.data
    : [];

  const meta = res?.data?.meta || null;
  return { data: payload, meta };
}

export async function getProductBySlug(slug) {
  if (!slug) return null;
  try {
    const { data } = await fetchProductsFromApi({ q: slug });
    const found = (data || []).find((p) => p.slug === slug);
    if (found) return found;
  } catch (e) {}
  const all = await fetchProductsFromApi();
  return (all.data || []).find((p) => p.slug === slug) || null;
}
