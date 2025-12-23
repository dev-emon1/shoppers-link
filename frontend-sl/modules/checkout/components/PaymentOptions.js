"use client";

import { CreditCard, HandCoins, Smartphone } from "lucide-react";
import { useEffect } from "react";
import { validatePayment } from "../utils/validation";

export default function PaymentOptions({
  value,
  onChange,
  errors = {},
  options = [],
  registerValidate,
}) {
  useEffect(() => {
    if (typeof registerValidate === "function") {
      const unregister = registerValidate(() => {
        // value might be string (method id) or object { method, card }
        const payload =
          typeof value === "string" ? { method: value } : value || {};
        const errs = validatePayment(payload);
        return { valid: Object.keys(errs).length === 0, errors: errs };
      });
      return () => unregister && unregister();
    }
  }, [value, registerValidate]);

  const renderIcon = (id) => {
    if (id === "cod") return <HandCoins size={18} />;
    if (id === "bkash") return <Smartphone size={18} />;
    return <CreditCard size={18} />;
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
        <CreditCard size={18} />
        Payment method
      </h2>
      <p className="text-xs md:text-sm text-textSecondary">
        Currently, Cash on Delivery
      </p>

      <div className="space-y-3">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => !option.disabled && onChange(option.id)}
            className={[
              "w-full flex items-start justify-between gap-3 rounded-xl border px-3 py-3 text-left transition",
              option.disabled
                ? "border-dashed border-border bg-gray-50 cursor-not-allowed opacity-70"
                : value === option.id
                ? "border-main bg-main/5"
                : "border-border bg-white hover:border-main/60",
            ].join(" ")}
          >
            <div>
              <div className="flex items-center gap-2">
                {renderIcon(option.id)}
                <p className="text-sm font-medium">{option.label}</p>
              </div>
              {option.description && (
                <p className="text-xs text-textSecondary mt-1">
                  {option.description}
                </p>
              )}
            </div>
            {!option.disabled && value === option.id && (
              <span className="text-xs font-semibold text-main">Selected</span>
            )}
          </button>
        ))}
        {errors.payment && (
          <p className="mt-1 text-xs text-red">{errors.payment}</p>
        )}
      </div>
    </div>
  );
}
