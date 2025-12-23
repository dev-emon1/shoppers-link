"use client";

import { useMemo } from "react";
import { shippingOptions } from "./useShipping";

export default function useCheckoutTotals({ totalPrice, shippingId }) {
  return useMemo(() => {
    const shippingFee =
      shippingOptions.find((s) => s.id === shippingId)?.fee || 0;

    return {
      subtotal: totalPrice || 0,
      shipping: shippingFee,
      grandTotal: (totalPrice || 0) + shippingFee,
    };
  }, [totalPrice, shippingId]);
}
