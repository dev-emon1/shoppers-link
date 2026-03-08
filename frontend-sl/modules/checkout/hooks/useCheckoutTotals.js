"use client";

import { useMemo } from "react";
import useShipping from "./useShipping";

export default function useCheckoutTotals({ totalPrice }) {
  const { shippingFee } = useShipping();

  return useMemo(() => {
    const subtotal = totalPrice || 0;

    return {
      subtotal,
      shipping_charge: shippingFee,
      grandTotal: subtotal + shippingFee,
    };
  }, [totalPrice, shippingFee]);
}
