// payments/.js
export const pay = async (payload) => {
  console.log("ssl payload", payload);
  return { status: "SUCCESS", orderId: "SSL-" + Date.now() };
};
