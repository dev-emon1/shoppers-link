"use client";

import { useState } from "react";

export const shippingOptions = [
  {
    id: "inside",
    label: "Inside Dhaka",
    description: "Delivery within 1–2 working days",
    fee: 60,
  },
  {
    id: "outside",
    label: "Outside Dhaka",
    description: "Delivery within 2–5 working days",
    fee: 120,
  },
];

export default function useShipping() {
  const [value, setValue] = useState("");
  const [errors, setErrors] = useState({});

  const onChange = (id) => {
    setValue(id);
  };

  const validate = () => {
    const e = {};
    if (!value) e.shipping = "Select a shipping option";
    setErrors(e);
    return e;
  };

  return {
    value,
    errors,
    onChange,
    validate,
    options: shippingOptions,
  };
}
