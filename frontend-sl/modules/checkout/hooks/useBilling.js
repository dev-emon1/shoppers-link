"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { hydrateBilling, updateBilling } from "../store/billingReducer";
import { validateBilling } from "../utils/validation";

export default function useBilling() {
  const dispatch = useDispatch();
  const { user } = useSelector((s) => s.auth);
  const billing = useSelector((s) => s.checkoutBilling.value);
  const errors = useSelector((s) => s.checkoutBilling.errors);
  const hydrated = useSelector((s) => s.checkoutBilling.hydrated);

  //
  useEffect(() => {
    if (hydrated || !user) return;

    dispatch(
      hydrateBilling({
        fullName: user?.customer?.full_name || "",
        phone: user?.customer?.contact_number || "",
        email: user?.email || "",
      }),
    );
  }, [user, hydrated, dispatch]);

  return {
    value: billing,
    errors,
    onChange: (next) => dispatch(updateBilling(next)),
    validate: () => validateBilling(billing || {}),
  };
}
