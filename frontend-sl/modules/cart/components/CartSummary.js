"use client";

import { useRouter } from "next/navigation";
import { TbCurrencyTaka } from "react-icons/tb";
import { formatPrice, toNumber } from "@/modules/cart/utils/utils";

const CartSummary = ({ totalItems = 0, totalPrice = 0, onClear }) => {
  const router = useRouter();

  // ✅ Core calculation (NO FAKE SHIPPING)
  const subtotal = toNumber(totalPrice);
  const grandTotal = subtotal;

  const handleClick = () => {
    router.push("/checkout");
  };
  // console.log(totalItems);

  const handleClear = () => {
    if (
      typeof window !== "undefined" &&
      !window.confirm("Clear all items from cart?")
    )
      return;
    onClear?.();
  };

  return (
    <aside className="bg-white p-6 rounded-2xl shadow-lg sticky top-24 self-start border border-gray-100 transition-all">
      {/* Header */}
      <h3 className="text-lg font-semibold mb-5 text-gray-800">
        Order Summary
      </h3>

      {/* Items */}
      <div className="flex justify-between mb-3 text-sm">
        <span className="text-gray-500">Total Items</span>
        <span className="font-medium text-gray-800">
          {Number(totalItems) || 0}
        </span>
      </div>

      {/* Subtotal */}
      <div className="flex justify-between mb-3 text-sm">
        <span className="text-gray-500">Subtotal</span>
        <span className="font-semibold text-gray-900 flex items-center gap-1">
          <TbCurrencyTaka size={14} />
          {formatPrice(subtotal)}
        </span>
      </div>

      {/* Shipping (REAL UX) */}
      <div className="flex justify-between mb-4 text-sm">
        <span className="text-gray-500">Shipping</span>
        <span className="text-gray-400 text-right">Calculated at checkout</span>
      </div>

      {/* Divider */}
      <div className="border-t border-dashed my-4"></div>

      {/* Total */}
      <div className="flex justify-between items-center font-semibold text-lg mb-5">
        <span className="text-gray-800">Total</span>
        <span className="flex items-center text-main gap-1">
          <TbCurrencyTaka size={18} />
          {formatPrice(grandTotal)}
        </span>
      </div>

      {/* Info note */}
      <p className="text-xs text-gray-400 text-center mb-4 leading-relaxed">
        Shipping & taxes will be calculated at checkout based on your delivery
        address.
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          onClick={handleClear}
          className="w-full border border-red-400 text-red-500 py-2 rounded-lg hover:bg-red-50 transition text-sm font-medium"
        >
          Clear Cart
        </button>

        <button
          onClick={handleClick}
          className="w-full bg-main text-white py-3 rounded-lg hover:bg-main/90 transition font-semibold shadow-md"
        >
          Proceed to Checkout →
        </button>
      </div>
    </aside>
  );
};

export default CartSummary;
