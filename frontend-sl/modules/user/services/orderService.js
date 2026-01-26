// modules/user/services/orderService.js
import api from "@/core/api/axiosClient";

const normalizeList = (resp) => {
  const body = resp?.data ?? null;
  if (!body) return { data: [], meta: null };
  if (Array.isArray(body)) return { data: body, meta: null };
  if (body.data && Array.isArray(body.data)) {
    const meta =
      body.meta ??
      body.additional?.meta ??
      (body.current_page
        ? {
            current_page: body.current_page,
            last_page: body.last_page,
            per_page: body.per_page,
            total: body.total,
          }
        : null);
    return { data: body.data, meta };
  }
  const arr = Object.values(body).find((v) => Array.isArray(v));
  if (arr) return { data: arr, meta: null };
  return { data: [], meta: null };
};

export const fetchOrdersApi = async (params = { page: 1, per_page: 10 }) => {
  const resp = await api.get("/customer/order/list", { params });
  return normalizeList(resp);
};

export const cancelOrderApi = async (orderId, payload = {}) => {
  const resp = await api.post(
    `/orders/${encodeURIComponent(orderId)}/cancel`,
    payload,
  );
  return resp?.data ?? null;
};

export const cancelVendorOrderApi = async (vendorOrderId, payload = {}) => {
  const resp = await api.post(
    `/vendor-orders/${encodeURIComponent(vendorOrderId)}/cancel`,
    payload,
  );
  return resp?.data ?? null;
};

export const submitReviewApi = async (vendorOrderItemId, payload) => {
  console.log(vendorOrderItemId);
  const formData = new FormData();
  formData.append("vendor_order_item_id", vendorOrderItemId);
  formData.append("rating", payload.rating);
  formData.append("body", payload.body);
  // Optional fields
  if (payload.title) formData.append("title", payload.title);
  if (payload.pros) formData.append("pros", payload.pros);
  if (payload.cons) formData.append("cons", payload.cons);
  if (payload.delivery_days)
    formData.append("delivery_days", payload.delivery_days);

  // Media
  payload.media.forEach((file, index) => {
    formData.append(`media[${index}]`, file);
  });

  try {
    const resp = await api.post("/reviews", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return resp?.data ?? null;
  } catch (err) {
    const errorMessage =
      err?.response?.data?.message || "Failed to submit review";
    throw new Error(errorMessage);
  }
};

export default {
  fetchOrdersApi,
  cancelOrderApi,
  cancelVendorOrderApi,
};
