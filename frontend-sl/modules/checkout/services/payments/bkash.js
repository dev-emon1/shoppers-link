// payments/bkash.js
export const pay = async (payload) => {
  return { status: "SUCCESS", orderId: "BK-" + Date.now() };
};
