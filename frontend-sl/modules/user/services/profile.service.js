import api from "@/core/api/axiosClient";

// Update name, phone, etc.
export const updateProfileApi = async (payload) => {
  const res = await api.post("/user/profile/update", payload);
  return res.data; // expect updated user/customer
};

// Update profile picture (multipart)
export const updateProfilePhotoApi = async (file) => {
  const form = new FormData();
  form.append("avatar", file);

  // ❌ no manual headers
  const res = await api.post("/user/profile/avatar", form);
  return res.data; // { profile_picture: "xxx.jpg" }
};

// Change password
export const changePasswordApi = async (payload) => {
  const res = await api.post("/change/password", payload);
  return res.data;
};
