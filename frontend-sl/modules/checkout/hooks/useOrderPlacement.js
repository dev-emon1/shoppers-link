"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { showToast } from "@/lib/utils/toast";
import { orderService } from "../services/order.service";
import { saveBillingAddress } from "../store/billingReducer";

export default function useOrderPlacement({
  billing,
  shipping,
  payment,
  totals,
  clearCart,
  cart,
  user,
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isPlacing, setIsPlacing] = useState(false);

  const placeOrder = async () => {
    try {
      setIsPlacing(true);

      if (!user?.customer?.id) {
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

      const vendors = vendorEntries
        .map(([vendorId, vendorData]) => {
          if (!Array.isArray(vendorData?.items)) return null;
          return {
            vendor_id: Number(vendorId),
            items: vendorData.items.map((item) => ({
              product_id: item.id,
              variant_id: item.variantId,
              qty: item.quantity,
              price: item.price,
              total: item.price * item.quantity,
            })),
          };
        })
        .filter(Boolean);

      // 🟢 SAVE BILLING ADDRESS (new user / no default)
      if (!user?.billingAddress && billing?.value?.line1) {
        await dispatch(
          saveBillingAddress({
            billing: billing.value,
            customerId: user.customer.id,
          })
        ).unwrap();
      }

      const payload = {
        customer_id: user.customer.id,
        payment_method: payment.value,
        shipping_address_id: billing?.value?.address_id || null,
        a_s_a: {
          billing: billing.value,
          shipping: shipping.value,
          totals,
        },
        vendors,
      };

      const response = await orderService.placeOrder(payload);

      showToast("🎉 Order placed successfully!");
      clearCart();

      const ref = response?.order?.unid;
      router.push(ref ? `/checkout/success?ref=${ref}` : "/checkout/success");

      return response;
    } catch (error) {
      console.error(error);
      showToast("❌ Failed to place order. Please try again.");
      throw error;
    } finally {
      setIsPlacing(false);
    }
  };

  return { placeOrder, isPlacing };
}
