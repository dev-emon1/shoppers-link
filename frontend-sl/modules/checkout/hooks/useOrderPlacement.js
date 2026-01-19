"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "@/lib/utils/toast";
import { orderService } from "../services/order.service";
import { saveBillingAddress } from "../store/billingReducer";
import { shippingOptions } from "../hooks/useShipping";
import { canSaveAddress } from "../utils/addressRules";

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

  const addresses = useSelector((s) => s.address.list || []);

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

      /* ---------- vendors ---------- */
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

      /* ---------- optional save ---------- */
      let savedAddressId = null;

      const saveCheck = canSaveAddress({
        billing: billing.value,
        existingAddresses: addresses,
      });

      if (saveCheck.ok) {
        try {
          const res = await dispatch(
            saveBillingAddress({
              billing: billing.value,
              customerId: user.customer.id,
              isDefault: billing.value.setAsDefault === true,
            }),
          ).unwrap();

          savedAddressId = res?.id || null;
        } catch {}
      } else if (billing.value.saveAddress && saveCheck.reason) {
        showToast(saveCheck.reason);
      }

      /* ---------- shipping snapshot (ALWAYS) ---------- */
      const selectedShipping = shippingOptions.find(
        (s) => s.id === shipping.value,
      );

      const payload = {
        customer_id: user.customer.id,
        payment_method: payment.value,
        vendors,
        a_s_a: {
          billing: {
            fullName: billing.value.fullName,
            phone: billing.value.phone,
            email: billing.value.email || null,
            line1: billing.value.line1,
            area: billing.value.area,
            city: billing.value.city,
            postalCode: billing.value.postalCode || null,
            notes: billing.value.notes || null,
            addressType: billing.value.addressType || "home",
          },
          shipping: {
            id: shipping.value,
            label: selectedShipping?.label || null,
            fee: selectedShipping?.fee || 0,
          },
          totals: {
            subtotal: totals.subtotal,
            shipping_charge: totals.shipping_charge,
            grandTotal: totals.grandTotal,
          },
        },
      };

      /* ---------- address reference ---------- */
      if (billing.value.selectedAddressId) {
        payload.shipping_address_id = billing.value.selectedAddressId;
      } else if (savedAddressId) {
        payload.shipping_address_id = savedAddressId;
      } else {
        payload.shipping_address_id = null;
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
