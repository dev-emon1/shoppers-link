import api from "@/core/api/axiosClient";

// Update name, phone, etc.
export const updateProfileApi = async (payload) => {
  const res = await api.post("/user/profile/update", payload);
  return res.data;
};

// Update profile picture (multipart form)
export const updateProfilePhotoApi = async (file) => {
  const form = new FormData();
  form.append("avatar", file);

  const res = await api.post("/user/profile/avatar", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// Change password
export const changePasswordApi = async (payload) => {
  const res = await api.post("/user/profile/change-password", payload);
  return res.data;
};
