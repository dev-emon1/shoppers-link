"use client";

import { Truck } from "lucide-react";
import { TbCurrencyTaka } from "react-icons/tb";
import { useState, useEffect } from "react";
import { formatAmount } from "../utils/format";
import useShipping from "../hooks/useShipping";

export default function ShippingOptions() {
  const { shippingFee, packages, loading } = useShipping();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (packages.length > 1) setShowDetails(true);
  }, [packages]);

  return (
    <div className="space-y-4">
      <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
        <Truck size={18} />
        Shipping
      </h2>

      <p className="text-xs md:text-sm text-textSecondary">
        Delivery charges are calculated based on vendor & location.
      </p>

      <div className="rounded-xl border border-border bg-white px-4 py-4 space-y-3">
        {/* TOP */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">Total Delivery Charge</p>
            <p className="text-xs text-textSecondary">
              {packages.length} package(s)
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

        {/* TOGGLE */}
        {packages.length > 0 && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs text-blue-600 hover:underline"
          >
            {showDetails ? "Hide details" : "View breakdown"}
          </button>
        )}

        {/* BREAKDOWN */}
        {showDetails && (
          <div className="border-t pt-3 space-y-3">
            {packages.map((pkg, index) => (
              <div
                key={index}
                className="flex items-center justify-between text-sm"
              >
                {/* LEFT */}
                <div className="flex items-center gap-3">
                  {/* ✅ LOGO */}
                  <img
                    src={pkg.vendor_logo || "/placeholder-store.png"}
                    alt={pkg.vendor_name}
                    className="w-10 h-10 rounded-lg object-cover border"
                  />

                  <div>
                    <p className="font-medium">
                      {pkg.vendor_name || `Vendor #${pkg.vendor_id}`}
                    </p>

                    <p className="text-xs text-textSecondary">
                      {pkg.applied_rule?.name}
                    </p>

                    {pkg.is_free && (
                      <span className="text-green-600 text-xs font-medium">
                        Free Shipping
                      </span>
                    )}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-1 font-semibold">
                  <TbCurrencyTaka size={13} />
                  {pkg.is_free ? "0" : formatAmount(pkg.shipping_charge)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
