"use client";

import { useState } from "react";

export const paymentOptions = [
  {
    id: "cod",
    label: "Cash on Delivery",
    description: "Pay with cash when you receive the order",
  },
  {
    id: "bkash",
    label: "bKash (Coming soon)",
    description: "Instant payment with bKash",
    disabled: true,
  },
  {
    id: "card",
    label: "Card (Coming soon)",
    description: "Secure online payment",
    disabled: true,
  },
];

export default function usePayment() {
  const [value, setValue] = useState("cod");
  const [errors, setErrors] = useState({});

  const onChange = (id) => {
    if (paymentOptions.find((p) => p.id === id && !p.disabled)) {
      setValue(id);
    }
  };

  const validate = () => {
    const e = {};
    if (!value) e.payment = "Select a payment method";
    setErrors(e);
    return e;
  };

  return {
    value,
    errors,
    onChange,
    validate,
    options: paymentOptions,
  };
}
