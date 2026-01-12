import api from "@/core/api/axiosClient";

export const fetchAllCategoriesApi = async () => {
  const res = await api.get("/allcategories");
  return res?.data?.data ?? res?.data ?? [];
};
