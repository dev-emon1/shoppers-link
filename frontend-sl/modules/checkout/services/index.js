import * as bkash from "./payments/bkash";
import * as nagad from "./payments/nagad";
import * as ssl from "./payments/sslcommerz";

export const payWith = async (method, payload) => {
  switch (method) {
    case "bkash":
      return bkash.pay(payload);
    case "nagad":
      return nagad.pay(payload);
    case "sslcommerz":
      return ssl.pay(payload);
    case "cod":
      return Promise.resolve({
        status: "SUCCESS",
        orderId: "COD-" + Date.now(),
        message: "Order placed with Cash on Delivery",
      });
    default:
      return { status: "ERROR", message: "Unsupported payment method" };
  }
};
