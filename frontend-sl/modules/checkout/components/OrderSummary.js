"use client";

import { TbCurrencyTaka } from "react-icons/tb";
import { formatAmount } from "../utils/format";
import useCart from "@/modules/cart/hooks/useCart";
import useShipping from "../hooks/useShipping";

export default function OrderSummary({ totals }) {
  const { cart, totalItems, totalPrice } = useCart();
  const { shippingFee, grandTotal } = useShipping();

  const flatCartItems = [];
  Object.values(cart || {}).forEach((vendor) => {
    (vendor.items || []).forEach((item) => flatCartItems.push(item));
  });

  return (
    <aside className="lg:sticky lg:top-24">
      <div className="rounded-2xl border border-border bg-white p-4 md:p-5 shadow-sm space-y-4">
        <h2 className="text-sm font-semibold mb-1">Order summary</h2>

        <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
          {flatCartItems.map((item) => (
            <div
              key={`${item.id}-${item.variantId || ""}`}
              className="flex items-center gap-3 text-xs"
            >
              {item.image && (
                <div className="h-12 w-12 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden border border-border">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="flex-1">
                <p className="font-medium text-[13px] line-clamp-2">
                  {item.name} <span>{item.sku}</span>
                </p>
                {item.variant && (
                  <p className="text-[11px] text-textSecondary">
                    {item.variant}
                  </p>
                )}
                <p className="text-[11px] text-textSecondary mt-0.5">
                  Qty: {item.quantity}
                </p>
              </div>
              <div className="flex flex-col items-end gap-0.5">
                <div className="flex items-center gap-1 font-semibold">
                  <TbCurrencyTaka size={12} />
                  <span>{formatAmount(item.price * item.quantity)}</span>
                </div>
                <p className="text-[11px] text-textSecondary">
                  <TbCurrencyTaka size={10} className="inline" />{" "}
                  {formatAmount(item.price)} / pc
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Items ({totalItems})</span>
            <span className="flex items-center gap-1">
              <TbCurrencyTaka size={14} />
              {formatAmount(totalPrice)}
            </span>
          </div>

          <div className="flex justify-between text-xs text-textSecondary">
            <span>Shipping</span>
            <span className="flex items-center gap-1">
              <TbCurrencyTaka size={13} />
              {formatAmount(shippingFee)}
            </span>
          </div>

          <div className="flex justify-between font-semibold mt-1">
            <span>Grand total</span>
            <span className="flex items-center gap-1 text-main">
              <TbCurrencyTaka size={15} />
              {formatAmount(grandTotal || totalPrice + shippingFee)}
            </span>
          </div>
        </div>

        <p className="text-[11px] text-textSecondary">
          By placing this order you agree to ShoppersLink’s terms & refund
          policy.
        </p>
      </div>
    </aside>
  );
}
