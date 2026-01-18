// "use client";
// import { useState } from "react";
// import { TbCurrencyTaka } from "react-icons/tb";
// import { useCheckoutSession } from "@/modules/checkout/hooks/useCheckoutSession";

// const OrderSummary = ({ totals }) => {
//   const { discountInfo, applyCoupon } = useCheckoutSession();
//   const [coupon, setCoupon] = useState("");
//   const [isApplying, setIsApplying] = useState(false);

//   const handleApplyCoupon = async () => {
//     if (!coupon.trim()) return;
//     setIsApplying(true);
//     setTimeout(() => {
//       applyCoupon(coupon);
//       setIsApplying(false);
//     }, 500);
//   };

//   const formatAmount = (value = 0) =>
//     Number(value).toLocaleString("en-BD", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     });

//   if (!totals)
//     return (
//       <div className="bg-white rounded-xl border border-border p-4 text-center text-gray-500">
//         Calculating totals...
//       </div>
//     );

//   return (
//     <div className="bg-white rounded-xl border border-border p-6 shadow-sm">
//       <h3 className="text-lg font-bold mb-4 text-textPrimary">Order Summary</h3>

//       {/* Summary Totals */}
//       <div className="space-y-2 text-sm">
//         <div className="flex justify-between">
//           <span>Subtotal</span>
//           <span className="flex items-center gap-1">
//             <TbCurrencyTaka size={12} />
//             {formatAmount(totals.subtotal)}
//           </span>
//         </div>

//         <div className="flex justify-between">
//           <span>Shipping</span>
//           <span className="flex items-center gap-1">
//             <TbCurrencyTaka size={12} />
//             {formatAmount(totals.shipping)}
//           </span>
//         </div>

//         {/* <div className="flex justify-between">
//           <span>VAT (5%)</span>
//           <span className="flex items-center gap-1">
//             <TbCurrencyTaka size={12} />
//             {formatAmount(totals.vat)}
//           </span>
//         </div> */}

//         {totals.discount > 0 && (
//           <div className="flex justify-between text-green-600">
//             <span>Discount</span>
//             <span className="flex items-center gap-1">
//               -<TbCurrencyTaka size={12} />
//               {formatAmount(totals.discount)}
//             </span>
//           </div>
//         )}

//         <hr className="my-2 border-gray-200" />

//         <div className="flex justify-between font-semibold text-base">
//           <span>Total Payable</span>
//           <span className="text-main flex items-center gap-1">
//             <TbCurrencyTaka size={14} />
//             {formatAmount(totals?.grandTotal)}
//           </span>
//         </div>
//       </div>

//       {/* Coupon Input */}
//       <div className="mt-5">
//         <label
//           htmlFor="coupon"
//           className="block text-sm font-medium text-gray-700 mb-1"
//         >
//           Have a coupon?
//         </label>
//         <div className="flex gap-2">
//           <input
//             id="coupon"
//             type="text"
//             value={coupon}
//             onChange={(e) => setCoupon(e.target.value)}
//             placeholder="Enter coupon code"
//             className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-main focus:border-main"
//           />
//           <button
//             onClick={handleApplyCoupon}
//             disabled={isApplying || !coupon.trim()}
//             className="bg-main text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-main/90 transition disabled:opacity-50"
//           >
//             {isApplying ? "Applying..." : "Apply"}
//           </button>
//         </div>

//         {discountInfo?.message && (
//           <p
//             className={`text-xs mt-2 ${
//               discountInfo.discount > 0 ? "text-green-600" : "text-red-500"
//             }`}
//           >
//             {discountInfo.message}
//           </p>
//         )}
//       </div>

//       <p className="text-xs text-gray-400 text-center mt-4">
//         VAT & applicable taxes included.
//       </p>
//     </div>
//   );
// };

// export default OrderSummary;

"use client";

import { TbCurrencyTaka } from "react-icons/tb";
import { formatAmount } from "../utils/format";
import useCart from "@/modules/cart/hooks/useCart"; // <-- UPDATED

export default function OrderSummary({ totals }) {
  const { cart, totalItems, totalPrice } = useCart();

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
              {formatAmount(totals.shipping)}
            </span>
          </div>

          <div className="flex justify-between font-semibold mt-1">
            <span>Grand total</span>
            <span className="flex items-center gap-1 text-main">
              <TbCurrencyTaka size={15} />
              {formatAmount(totals.grandTotal)}
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
