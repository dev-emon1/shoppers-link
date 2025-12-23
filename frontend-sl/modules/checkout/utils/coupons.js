export const validateCoupon = (code, subtotal) => {
  const coupons = {
    SHOP100: { type: "flat", amount: 100 },
    SAVE10: { type: "percent", amount: 10 },
  };

  const found = coupons[code.toUpperCase()];
  if (!found) return { valid: false, discount: 0 };

  const discount =
    found.type === "flat" ? found.amount : (subtotal * found.amount) / 100;

  return { valid: true, discount };
};
