// payments/.js
export const pay = async (payload) => {
  return { status: "SUCCESS", orderId: "SSL-" + Date.now() };
};
