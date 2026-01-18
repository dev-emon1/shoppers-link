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

      const vendors = Object.entries(cart || {})
        .map(([vendorId, vendorData]) => ({
          vendor_id: Number(vendorId),
          items: vendorData.items.map((item) => ({
            product_id: item.id,
            variant_id: item.variantId,
            qty: item.quantity,
            price: item.price,
            total: item.price * item.quantity,
          })),
        }))
        .filter((v) => v.items.length);

      /* 🔹 Optional address save */
      if (billing.value.saveAddress) {
        try {
          await dispatch(
            saveBillingAddress({
              billing: billing.value,
              customerId: user.customer.id,
              isDefault: billing.value.setAsDefault === true,
            }),
          ).unwrap();
        } catch {
          // ignore save failure
        }
      }

      const payload = {
        customer_id: user.customer.id,
        payment_method: payment.value,
        shipping_address_id: null,
        vendors,
        a_s_a: {
          billing: billing.value,
          shipping: shipping.value,
          totals,
        },
      };

      const response = await orderService.placeOrder(payload);

      showToast("🎉 Order placed successfully!");
      clearCart();

      router.push(`/checkout/success?ref=${response.order.unid}`);
    } finally {
      setIsPlacing(false);
    }
  };

  return { placeOrder, isPlacing };
}
