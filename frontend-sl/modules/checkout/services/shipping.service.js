// services/order.service.js

import api from "@/core/api/axiosClient";

export const calculateShippingApi = async (payload) => {
  console.log(payload);
  try {
    const res = await api.post("/shipping/calculate", payload);
    return res.data;
  } catch (error) {
    throw error;
  }
};
