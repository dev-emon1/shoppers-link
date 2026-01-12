// services/addressService.js
import api from "@/core/api/axiosClient";

export const getAddressesApi = async (customerId) => {
  // UPDATED: Matches /user/customer/addresses/{customerId}
  const res = await api.get(`/user/customer/addresses/${customerId}`);
  return res.data;
};
export const addAddressApi = async (payload) => {
  // payload: { customer_id, address_line1, city, state, postal_code, country, is_default }
  const res = await api.post("/user/customer/addresses/store", payload);
  return res.data;
};

export const updateAddressApi = async (id, payload) => {
  const res = await api.put(`/user/customer/addresses/update/${id}`, payload);
  return res.data;
};

export const deleteAddressApi = async (id) => {
  const res = await api.delete(`/user/customer/addresses/delete/${id}`);
  return res.data;
};
