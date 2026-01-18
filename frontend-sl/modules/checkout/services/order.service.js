// services/order.service.js

import api from "@/core/api/axiosClient";

export const orderService = {
  // Multi-vendor order placement
  placeOrder: async (payload) => {
    // console.log(payload);
    console.log("Placing Order:-", payload);
    try {
      const { data } = await api.post("/order", payload);
      return data;
    } catch (error) {
      throw error;
    }
  },
};
