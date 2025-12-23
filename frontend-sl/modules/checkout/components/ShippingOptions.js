"use client";

import { useEffect, useState } from "react";
import { Truck } from "lucide-react";
import { TbCurrencyTaka } from "react-icons/tb";
import { formatAmount } from "../utils/format";
import { validateShipping } from "../utils/validation";

export default function ShippingOptions({
  value,
  onChange,
  errors = {},
  options = [],
  registerValidate,
}) {
  const [localErrors, setLocalErrors] = useState(errors || {});

  useEffect(() => {
    setLocalErrors(errors || {});
  }, [errors]);

  useEffect(() => {
    if (typeof registerValidate === "function") {
      const unregister = registerValidate(() => {
        const errs = validateShipping(value);
        setLocalErrors(errs || {});
        const firstKey = Object.keys(errs || {})[0];
        const focusSelector = null;
        return {
          valid: Object.keys(errs).length === 0,
          errors: errs,
          focusSelector,
        };
      });
      return () => unregister && unregister();
    }
  }, [value, registerValidate]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
        <Truck size={18} />
        Shipping
      </h2>
      <p className="text-xs md:text-sm text-textSecondary">
        Delivery charges will vary based on the location.
      </p>

      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={[
              "w-full flex items-start justify-between gap-3 rounded-xl border px-3 py-3 text-left transition",
              value === option.id
                ? "border-main bg-main/5"
                : "border-border bg-white hover:border-main/60",
            ].join(" ")}
          >
            <div>
              <p className="text-sm font-medium">{option.label}</p>
              <p className="text-xs text-textSecondary">{option.description}</p>
            </div>
            <div className="flex items-center gap-1 text-sm font-semibold text-main">
              <TbCurrencyTaka size={14} />
              <span>{formatAmount(option.fee)}</span>
            </div>
          </button>
        ))}

        {(localErrors.shipping || errors.shipping) && (
          <p className="mt-1 text-xs text-red">
            {localErrors.shipping || errors.shipping}
          </p>
        )}
      </div>
    </div>
  );
}
