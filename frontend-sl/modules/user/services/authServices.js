import api from "@/core/api/axiosClient";

export const loginUserApi = async ({ email, phone, password }) => {
  const res = await api.post("/login", {
    login: email || phone,
    password,
  });

  return res.data;
};
