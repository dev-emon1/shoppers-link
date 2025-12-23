// frontend-sl/modules/product/services/reviewService.js
import api from "@/core/api/axiosClient";

/**
 * Simple service functions to be consumed by RTK thunks or components.
 * Note: backend path assumed: /products/:productId/reviews
 */

export const fetchReviewsFromApi = async (productId, params = {}) => {
  if (!productId) throw new Error("productId required");
  const res = await api.get(`/products/${productId}/reviews`, { params });
  // return res.data (consistent with other services)
  return res.data;
};

export const submitReviewToApi = async (productId, payload = {}) => {
  if (!productId) throw new Error("productId required");
  const images = Array.isArray(payload.images) ? payload.images : null;

  if (images && images.length) {
    const fd = new FormData();
    Object.keys(payload).forEach((k) => {
      if (k === "images") return;
      const v = payload[k];
      if (v === undefined || v === null) return;
      // primitive values appended as-is; complex objects stringify
      fd.append(k, typeof v === "object" ? JSON.stringify(v) : String(v));
    });
    images.forEach((file, idx) => {
      fd.append("images[]", file, file.name || `image_${idx}.jpg`);
    });

    const res = await api.post(`/products/${productId}/reviews`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  }

  // JSON post
  const body = { ...payload };
  delete body.images;
  const res = await api.post(`/products/${productId}/reviews`, body);
  return res.data;
};

/**
 * Client-side convenience: fetch /customer/order/list and check delivered items
 * (UI gating only — server MUST enforce)
 */
export const userHasDeliveredProduct = async ({
  productId,
  variantId = null,
  orderId = null,
} = {}) => {
  if (!productId) return { canReview: false, reason: "productId required" };
  try {
    const res = await api.get("/customer/order/list");
    const orders = res?.data?.data || [];

    for (const order of orders) {
      if (orderId && String(order.unid) !== String(orderId)) continue;
      const vendorOrders = Array.isArray(order.vendor_orders)
        ? order.vendor_orders
        : [];

      for (const v of vendorOrders) {
        const status = (v.status || "").toLowerCase();
        if (status !== "delivered") continue; // only delivered allowed

        for (const it of v.items || []) {
          const prodMatch = String(it.product_id) === String(productId);
          const varMatch = variantId
            ? String(it.product_variant_id) === String(variantId)
            : true;
          if (prodMatch && varMatch) {
            return { canReview: true, matchedOrder: order };
          }
        }
      }
    }

    return {
      canReview: false,
      reason: "No delivered order found for this product",
    };
  } catch (err) {
    console.error("userHasDeliveredProduct error:", err);
    return { canReview: false, reason: "Failed to verify orders" };
  }
};
