// payments/.js
export const pay = async (payload) => {
  console.log("sp payload", payload);
  return { status: "SUCCESS", orderId: "SP-" + Date.now() };
};
