"use client";

import { Truck } from "lucide-react";
import { TbCurrencyTaka } from "react-icons/tb";
import { formatAmount } from "../utils/format";
import useShipping from "../hooks/useShipping";

export default function ShippingOptions() {
  const { shippingFee, loading } = useShipping();

  console.log(shippingFee);

  return (
    <div className="space-y-4">
      <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
        <Truck size={18} />
        Shipping
      </h2>

      <p className="text-xs md:text-sm text-textSecondary">
        Delivery charges are automatically calculated based on your location.
      </p>

      <div className="rounded-xl border border-border bg-white px-4 py-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium">Standard Delivery</p>
          <p className="text-xs text-textSecondary">
            Shipping charge depends on your delivery area.
          </p>
        </div>

        <div className="flex items-center gap-1 text-sm font-semibold text-main">
          <TbCurrencyTaka size={14} />

          {loading ? (
            <span>Calculating...</span>
          ) : (
            <span>{formatAmount(shippingFee)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
