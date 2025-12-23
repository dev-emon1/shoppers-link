// payments/.js
export const pay = async (payload) => {
  console.log("nagad payload", payload);
  return { status: "SUCCESS", orderId: "NG-" + Date.now() };
};
