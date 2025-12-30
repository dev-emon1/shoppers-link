"use client";

import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { validateBilling as validateBillingUtil } from "../utils/validation";

const initialBilling = {
  fullName: "",
  phone: "",
  email: "",
  line1: "",
  city: "",
  area: "",
  postalCode: "",
  notes: "",
};

export default function useBilling() {
  const { user } = useSelector((state) => state.auth || {});
  const [value, setValue] = useState(initialBilling);
  const [errors, setErrors] = useState({});

  // load from user or localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    let fromUser = null;

    if (user) {
      const billingSource =
        user.billingAddress ||
        user.billing_address ||
        user.defaultAddress ||
        user.default_address;

      if (billingSource) {

        fromUser = {
          fullName: billingSource.fullName || billingSource.name || "",
          phone: billingSource.phone || "",
          email: billingSource.email || user.email || "",
          line1: billingSource.line1 || "",
          city: billingSource.city || "",
          area: billingSource.area || "",
          postalCode: billingSource.postalCode || billingSource.postcode || "",
          notes: billingSource.notes || "",
        };
      }
    }

    if (!fromUser) {
      const stored = window.localStorage.getItem("billing_address");
      if (stored) {
        try {
          fromUser = JSON.parse(stored);
        } catch {
          fromUser = null;
        }
      }
    }

    if (fromUser) {
      setValue((prev) => ({ ...prev, ...fromUser }));
    }
  }, [user]);

  const hasSavedBilling = useMemo(() => {
    if (typeof window === "undefined") return false;
    if (user?.billingAddress || user?.billing_address) return true;
    return !!window.localStorage.getItem("billing_address");
  }, [user]);

  const onChange = (next) => {
    setValue(next);
  };

  const validate = () => {
    const validationErrors = validateBillingUtil(value);
    setErrors(validationErrors);
    return validationErrors;
  };

  const saveToLocal = () => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem("billing_address", JSON.stringify(value));
  };

  const useSavedBilling = () => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem("billing_address");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      setValue((prev) => ({ ...prev, ...parsed }));
    } catch {
      // ignore
    }
  };

  return {
    value,
    errors,
    onChange,
    validate,
    hasSavedBilling,
    saveToLocal,
    useSavedBilling,
  };
}
