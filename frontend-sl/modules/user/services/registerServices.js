import api from "@/core/api/axiosClient";

export const registerUserApi = async ({ name, email, phone, password }) => {
  const res = await api.post("/customer/register", {
    name,
    email,
    phone,
    password,
  });
  return res.data;
};

export const verifyOtpApi = async ({ email, phone, otp, purpose }) => {
  const res = await api.post("/otp/verify", {
    email,
    phone,
    otp,
    purpose,
  });
  return res.data;
};
