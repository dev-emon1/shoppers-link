// payments/bkash.js
export const pay = async (payload) => {
  console.log("bKash payload", payload);
  return { status: "SUCCESS", orderId: "BK-" + Date.now() };
};
