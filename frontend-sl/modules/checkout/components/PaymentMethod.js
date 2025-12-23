"use client";
import { useCheckoutSession } from "@/modules/checkout/hooks/useCheckoutSession";
import { useEffect, useState, useCallback } from "react";
import { SUPPORTED_PAYMENT_METHODS } from "../constants";
import { CreditCard, Smartphone, HandCoins } from "lucide-react";

const iconMap = {
  bkash: <Smartphone size={16} />,
  visa: <CreditCard size={16} />,
  master: <CreditCard size={16} />,
  cod: <HandCoins size={16} />,
};

const PaymentMethod = () => {
  const { payment, setPayment } = useCheckoutSession();
  const [method, setMethod] = useState(payment?.method || "");

  useEffect(() => {
    if (method) setPayment((prev) => ({ ...prev, method }));
  }, [method, setPayment]);

  const handleSelect = useCallback((id) => setMethod(id), []);

  return (
    <div className="space-y-3">
      {SUPPORTED_PAYMENT_METHODS.map((opt) => {
        const isActive = method === opt.id;
        return (
          <label
            key={opt.id}
            className={`flex items-center justify-between border rounded-lg px-4 py-3 cursor-pointer transition
              ${
                isActive
                  ? "border-main bg-main/5 shadow-sm"
                  : "border-gray-200 hover:border-main/40"
              }`}
          >
            <div className="flex items-center gap-3">
              <span>{iconMap[opt.id]}</span>
              <div>
                <p className="text-sm font-medium text-gray-800">{opt.label}</p>
                {opt.id === "cod" && (
                  <p className="text-xs text-gray-500">
                    Pay in cash on delivery
                  </p>
                )}
              </div>
            </div>
            <input
              type="radio"
              name="payment"
              checked={isActive}
              onChange={() => handleSelect(opt.id)}
            />
          </label>
        );
      })}
      {method && (
        <p className="text-xs text-gray-500 pl-1">
          Selected:{" "}
          <span className="font-semibold text-main uppercase">{method}</span>
        </p>
      )}
    </div>
  );
};

export default PaymentMethod;
