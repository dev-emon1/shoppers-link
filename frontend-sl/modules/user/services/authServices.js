import api from "@/core/api/axiosClient";

export const loginUserApi = async ({ email, phone, password, type }) => {
  const res = await api.post("/login", {
    login: email || phone,
    password,
    type,
  });

  return res.data;
};
