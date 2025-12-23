// modules/checkout/hooks/useOrderPlacement.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { showToast } from "@/lib/utils/toast";
import { orderService } from "../services/order.service";

export default function useOrderPlacement({
  billing,
  shipping,
  payment,
  totals,
  clearCart,
  cart,
  user,
}) {
  console.log(cart);
  const router = useRouter();
  const [isPlacing, setIsPlacing] = useState(false);
  // console.log(user);

  const placeOrder = async () => {
    try {
      setIsPlacing(true);

      // Basic safety checks
      if (!user?.id) {
        showToast("Please login to place order.");
        return;
      }

      if (!payment?.value) {
        showToast("Please select a payment method.");
        return;
      }

      const vendorEntries = Object.entries(cart || {});
      if (!vendorEntries.length) {
        showToast("Your cart is empty.");
        return;
      }

      //  Build vendor-wise items array from cart
      const vendors = vendorEntries
        .map(([vendorId, vendorData]) => {
          const itemsArray = Array.isArray(vendorData?.items)
            ? vendorData.items
            : [];

          if (!itemsArray.length) return null;

          return {
            vendor_id: Number(vendorId),
            items: itemsArray.map((item) => ({
              product_id: item.id,
              variant_id: item.variantId, // must exist in cart items
              qty: item.quantity,
              price: item.price,
              total: item.price * item.quantity,
            })),
          };
        })
        .filter(Boolean);

      if (!vendors.length) {
        showToast("Your cart is empty.");
        return;
      }

      //  Final payload structure
      const payload = {
        customer_id: user?.customer?.id,
        payment_method: payment.value, // "cod", "bkash", etc.
        shipping_address_id: billing?.value?.address_id || null,
        a_s_a: {
          billing: billing?.value || null,
          shipping: shipping?.value || null,
          totals: totals || null,
        },
        vendors,
      };

      // 🚀 Real API call
      console.log(payload);
      const response = await orderService.placeOrder(payload);

      // 🔐 Optional: verify response (basic)
      if (response?.orders && Array.isArray(response.orders)) {
        showToast("🎉 Order placed successfully!");
      } else {
        showToast("🎉 Order placed (response received).");
      }

      // 🧹 Clear cart after success
      clearCart();

      const successOrderId = response?.order?.unid;
      if (successOrderId) {
        router.push(`/checkout/success?ref=${successOrderId}`);
      } else {
        router.push(`/checkout/success`);
      }

      return response;
    } catch (error) {
      console.error("❌ Order placement error:", error);

      if (error.response?.data?.error) {
        showToast(`❌ ${error.response.data.error}`);
      } else {
        showToast("❌ Failed to place order. Please try again.");
      }

      throw error;
    } finally {
      setIsPlacing(false);
    }
  };

  return {
    placeOrder,
    isPlacing,
  };
}
