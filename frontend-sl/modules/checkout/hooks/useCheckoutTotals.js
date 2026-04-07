"use client";

import { useMemo } from "react";
import useShipping from "./useShipping";

export default function useCheckoutTotals({ totalPrice }) {
  const { shippingFee } = useShipping();

  return useMemo(() => {
    const subtotal = totalPrice || 0;

    return {
<<<<<<< HEAD
      subtotal: totalPrice || 0,
      shipping_charge: shippingFee,
      grandTotal: (totalPrice || 0) + shippingFee,
=======
      subtotal,
      shipping_charge: shippingFee,
      grandTotal: subtotal + shippingFee,
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
    };
  }, [totalPrice, shippingFee]);
}
