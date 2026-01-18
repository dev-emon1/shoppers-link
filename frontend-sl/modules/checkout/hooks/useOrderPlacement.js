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
          })),
        }))
        .filter((v) => v.items.length);

      let savedAddressId = null;

      /* ---------- optional save ---------- */
      if (billing.value.saveAddress) {
        try {
          const res = await dispatch(
            saveBillingAddress({
              billing: billing.value,
              customerId: user.customer.id,
              isDefault: billing.value.setAsDefault === true,
            }),
          ).unwrap();

          savedAddressId = res?.id || null;
        } catch {
          // ignore save error
        }
      }

      const payload = {
        customer_id: user.customer.id,
        payment_method: payment.value,
        vendors,
      };

      /* ---------- address priority ---------- */
      if (billing.value.selectedAddressId) {
        payload.shipping_address_id = billing.value.selectedAddressId;
      } else if (savedAddressId) {
        payload.shipping_address_id = savedAddressId;
      } else {
        payload.shipping_address_id = null;
        payload.a_s_a = {
          billing: {
            fullName: billing.value.fullName,
            phone: billing.value.phone,
            email: billing.value.email || null,
            line1: billing.value.line1,
            area: billing.value.area,
            city: billing.value.city,
            postalCode: billing.value.postalCode || null,
            notes: billing.value.notes || null,
          },
          shipping_method: shipping.value,
          totals,
        };
      }

      const res = await orderService.placeOrder(payload);

      showToast("🎉 Order placed successfully!");
      clearCart();
      router.push(`/checkout/success?ref=${res.order.unid}`);
    } finally {
      setIsPlacing(false);
    }
  };

  return { placeOrder, isPlacing };
}
