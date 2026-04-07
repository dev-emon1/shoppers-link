// services/order.service.js

import api from "@/core/api/axiosClient";

export const orderService = {
  // Multi-vendor order placement
  placeOrder: async (payload) => {
<<<<<<< HEAD
    // console.log(payload);
    console.log("Placing Order:-", payload);
=======
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
    try {
      const { data } = await api.post("/order", payload);
      return data;
    } catch (error) {
      throw error;
    }
  },
};
