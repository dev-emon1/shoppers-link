"use client";

import { useEffect, useState } from "react";
import useCart from "@/modules/cart/hooks/useCart";
import VendorGroup from "@/modules/cart/components/VendorGroup";
import CartSummary from "@/modules/cart/components/CartSummary";
import EmptyCart from "@/modules/cart/components/EmptyCart";

const CartPage = () => {
  const { cart, totalItems, totalPrice, remove, updateQty, clear } = useCart();

  // 🔑 hydration guard
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const vendors = mounted ? cart || {} : {};
  const vendorKeys = Object.keys(vendors);

  return (
    <section className="container py-10 min-h-screen">
      {/* Header */}
      <div className="mb-8 text-center lg:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-textPrimary">
          Your Shopping Cart
        </h1>
        <p className="text-textSecondary mt-1">
          Review your items and proceed to secure checkout.
        </p>
      </div>

      {/* Body */}
      {!mounted ? (
        // ✅ SSR + first client render SAME
        <div className="text-center py-24 text-gray-400">Loading cart...</div>
      ) : vendorKeys.length === 0 ? (
        // Empty cart (client only)
        <EmptyCart />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {vendorKeys.map((vendorId) => (
              <VendorGroup
                key={vendorId}
                vendorId={vendorId}
                vendorData={vendors[vendorId]}
                onRemove={remove}
                onQuantityChange={updateQty}
              />
            ))}
          </div>

          {/* Cart Summary */}
          <CartSummary
            totalItems={totalItems}
            totalPrice={totalPrice}
            onClear={clear}
          />
        </div>
      )}
    </section>
  );
};

export default CartPage;
