export const mockPay = async ({ amount, orderId, shouldFail = false }) => {
  await new Promise((r) => setTimeout(r, 1200));

  if (shouldFail) {
    return { ok: false, error: "Mock payment failed" };
  }

  return {
    ok: true,
    txnId: "MOCK-" + Math.random().toString(36).slice(2, 10).toUpperCase(),
    orderId,
    amount,
  };
};
