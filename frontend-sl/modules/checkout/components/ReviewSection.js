"use client";

import { TbCurrencyTaka } from "react-icons/tb";
import { formatAmount } from "../utils/format";
import { shippingOptions } from "../hooks/useShipping";

export default function ReviewSection({
  billing,
  shippingId,
  paymentId,
  cart,
  totals,
}) {
  const shipping = shippingOptions.find((s) => s.id === shippingId);

  const flatCartItems = [];
  Object.values(cart || {}).forEach((vendor) => {
    (vendor.items || []).forEach((item) => flatCartItems.push(item));
  });

  return (
    <div className="space-y-6">
      {/* Billing */}
      <div className="rounded-2xl border border-border bg-white p-4">
        <h3 className="text-sm font-semibold mb-3">Billing & delivery</h3>
        <p className="text-sm font-medium">{billing.fullName}</p>
        <p className="text-xs text-textSecondary">{billing.phone}</p>
        <p className="text-xs text-textSecondary mt-1">
          {billing.line1}, {billing.area && `${billing.area}, `}
          {billing.city} {billing.postcode && `- ${billing.postcode}`}
        </p>
        {billing.notes && (
          <p className="mt-2 text-xs text-textSecondary italic">
            Note: {billing.notes}
          </p>
        )}
      </div>

      {/* Shipping */}
      <div className="rounded-2xl border border-border bg-white p-4">
        <h3 className="text-sm font-semibold mb-3">Shipping</h3>
        <p className="text-sm">
          {shipping ? shipping.label : "Not selected yet"}
        </p>
      </div>

      {/* Payment */}
      <div className="rounded-2xl border border-border bg-white p-4">
        <h3 className="text-sm font-semibold mb-3">Payment</h3>
        <p className="text-sm capitalize">
          {paymentId === "cod"
            ? "Cash on Delivery"
            : paymentId === "bkash"
              ? "bKash"
              : "Not selected"}
        </p>
      </div>

      {/* Items */}
      <div className="rounded-2xl border border-border bg-white p-4">
        <h3 className="text-sm font-semibold mb-3">
          Items ({flatCartItems.length})
        </h3>
        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {flatCartItems.map((item) => (
            <div
              key={`${item.id}-${item.variantId || ""}`}
              className="flex items-start justify-between gap-3 text-xs"
            >
              <div className="flex-1">
                <p className="font-medium text-[13px]">{item.name}</p>
                {item.variant && (
                  <p className="text-[11px] text-textSecondary">
                    {item.variant}
                  </p>
                )}
                <p className="text-[11px] text-textSecondary mt-0.5">
                  Qty: {item.quantity}
                </p>
              </div>
              <div className="flex items-center gap-1 font-semibold">
                <TbCurrencyTaka size={12} />
                <span>{formatAmount(item.price * item.quantity)}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-border text-sm space-y-1">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="flex items-center gap-1">
              <TbCurrencyTaka size={14} />
              {formatAmount(totals.subtotal)}
            </span>
          </div>
          <div className="flex justify-between text-xs text-textSecondary">
            <span>Shipping</span>
            <span className="flex items-center gap-1">
              <TbCurrencyTaka size={13} />
              {formatAmount(totals.shipping_charge)}
            </span>
          </div>
          <div className="flex justify-between font-semibold mt-1">
            <span>Total payable</span>
            <span className="flex items-center gap-1 text-main">
              <TbCurrencyTaka size={15} />
              {formatAmount(totals.grandTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
