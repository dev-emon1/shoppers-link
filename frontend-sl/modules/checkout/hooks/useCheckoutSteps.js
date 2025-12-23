"use client";

import { useState, useRef } from "react";

export const steps = [
  { id: 1, key: "billing", label: "Billing details" },
  { id: 2, key: "shipping", label: "Shipping" },
  { id: 3, key: "payment", label: "Payment" },
  { id: 4, key: "review", label: "Review & confirm" },
];

export default function useCheckoutSteps() {
  const [activeStep, setActiveStep] = useState(1);
  const validatorsRef = useRef({});

  // register a validator for a step key, returns unregister fn
  const registerValidator = (key, fn) => {
    if (!key || typeof fn !== "function") return () => {};
    validatorsRef.current[key] = fn;
    return () => {
      delete validatorsRef.current[key];
    };
  };

  const goNext = async () => {
    // find current step key
    const currentStep = steps[activeStep - 1];
    const key = currentStep?.key;
    const validator = validatorsRef.current[key];

    // if validator exists, run it and block if invalid
    if (typeof validator === "function") {
      try {
        const res = await Promise.resolve(validator());
        let valid = false;
        if (typeof res === "boolean") valid = res;
        else if (res && typeof res === "object") valid = !!res.valid;
        else valid = false;

        if (!valid) {
          if (res && res.focusSelector) {
            const el = document.querySelector(res.focusSelector);
            if (el && typeof el.focus === "function") el.focus();
          }
          return;
        }
      } catch (e) {
        console.error("Validator error for step", key, e);
        return;
      }
    }

    // advance
    setActiveStep((s) => Math.min(s + 1, steps.length));
  };

  const goBack = () => {
    setActiveStep((s) => Math.max(s - 1, 1));
  };

  const setStep = (id) => {
    if (id >= 1 && id <= steps.length) setActiveStep(id);
  };

  return {
    activeStep,
    goNext,
    goBack,
    setStep,
    steps,
    registerValidator,
  };
}
