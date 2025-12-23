// modules/user/services/reviewService.js
import api from "@/core/api/axiosClient";

export const submitReviewApi = async (vendorOrderItemId, payload) => {
  const formData = new FormData();
  // console.log(formData);

  formData.append("vendor_order_item_id", vendorOrderItemId);
  formData.append("rating", payload.rating);
  formData.append("body", payload.body);

  if (payload.title) formData.append("title", payload.title);
  if (payload.pros) formData.append("pros", payload.pros);
  if (payload.cons) formData.append("cons", payload.cons);
  // if (payload.delivery_days)
  //   formData.append("delivery_days", payload.delivery_days);

  // payload.media?.forEach((file, i) => {
  //   formData.append(`media[${i}]`, file);
  // });
  if (payload.media && payload.media.length > 0) {
    payload.media.forEach((file) => {
      formData.append("media[]", file);
    });
  }
  const resp = await api.post("/reviews", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return resp.data;
};
