"use client";

import { Lock } from "lucide-react";
import { useSelector } from "react-redux";
import { useEffect, useState, useRef } from "react";
import AddressSelector from "@/modules/checkout/components/AddressSelector";
import AddressModal from "@/modules/user/dashboard/address/AddressModal";
import useCart from "@/modules/cart/hooks/useCart";
import useCachedAddresses from "@/modules/user/hooks/useCachedAddresses";

import CheckoutGuard from "@/modules/checkout/components/CheckoutGuard";
import Stepper from "@/modules/checkout/components/Stepper";
import BillingForm from "@/modules/checkout/components/BillingForm";
import ShippingOptions from "@/modules/checkout/components/ShippingOptions";
import PaymentOptions from "@/modules/checkout/components/PaymentOptions";
import ReviewSection from "@/modules/checkout/components/ReviewSection";
import OrderSummary from "@/modules/checkout/components/OrderSummary";
import CheckoutFooterActions from "@/modules/checkout/components/CheckoutFooterActions";

import useBilling from "@/modules/checkout/hooks/useBilling";
import useShipping from "@/modules/checkout/hooks/useShipping";
import usePayment from "@/modules/checkout/hooks/usePayment";
import useCheckoutSteps, {
  steps as checkoutSteps,
} from "@/modules/checkout/hooks/useCheckoutSteps";
import useCheckoutTotals from "@/modules/checkout/hooks/useCheckoutTotals";
import useOrderPlacement from "@/modules/checkout/hooks/useOrderPlacement";

export default function CheckoutPage() {
  // State
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [editingAddress, setEditingAddress] = useState(null);
  const [openAddressModal, setOpenAddressModal] = useState(false);

  // Shipping optimization
  const [debouncedArea, setDebouncedArea] = useState(null);
  const lastPayloadRef = useRef(null);

  /* CART */
  const { cart, totalItems, totalPrice, clear: clearCart } = useCart();

  /* USER */
  const user = useSelector((state) => state.auth.user);
  const { addresses } = useCachedAddresses(user?.customer?.id);

  /* STEPS */
  const steps = checkoutSteps;
  const { activeStep, goNext, goBack, registerValidator } = useCheckoutSteps();

  /* HOOKS */
  const billing = useBilling();
  const shipping = useShipping();
  const payment = usePayment();

  const { calculateShipping } = shipping;

  /* ---------------- HELPERS ---------------- */

  const isValidArea = (area) =>
    typeof area === "string" && area.trim().length >= 3;

  const buildShippingPayload = (cart, area) => {
    const vendorMap = {};

    Object.entries(cart || {}).forEach(([vendorId, vendor]) => {
      if (!vendorMap[vendorId]) {
        vendorMap[vendorId] = {
          vendor_id: Number(vendorId),
          items: [],
        };
      }

      vendor.items.forEach((item) => {
        vendorMap[vendorId].items.push({
          weight: item.weight || 0.5,
          qty: item.quantity,
          price: item.price,
        });
      });
    });

    return {
      vendors: Object.values(vendorMap),
      area,
    };
  };

  /* ---------------- DEBOUNCE AREA ---------------- */

  useEffect(() => {
    const area = selectedAddress?.area || billing.value?.area;

    const t = setTimeout(() => {
      setDebouncedArea(area);
    }, 400);

    return () => clearTimeout(t);
  }, [selectedAddress, billing.value?.area]);

  /* ---------------- SHIPPING ---------------- */

  useEffect(() => {
    if (!isValidArea(debouncedArea)) return;
    if (!Object.keys(cart || {}).length) return;

    const payload = buildShippingPayload(cart, debouncedArea);

    if (JSON.stringify(payload) === JSON.stringify(lastPayloadRef.current)) {
      return;
    }

    lastPayloadRef.current = payload;

    calculateShipping(payload);
  }, [debouncedArea, cart]);

  /* ---------------- VALIDATOR ---------------- */

  useEffect(() => {
    if (!registerValidator) return;

    registerValidator("billing", () => {
      if (selectedAddress) return { valid: true };
      return billing.validate();
    });
  }, [selectedAddress, billing.value, registerValidator]);

  /* ---------------- DEFAULT ADDRESS AUTO SELECT ---------------- */

  useEffect(() => {
    if (!addresses.length) return;
    if (selectedAddress?.id) return;

    const defaultAddr =
      addresses.find((a) => a.is_default === 1) || addresses[0];

    if (defaultAddr) {
      setSelectedAddress(defaultAddr);

      billing.onChange({
        ...billing.value,
        selectedAddressId: defaultAddr.id,
        line1: defaultAddr.address_line1,
        area: defaultAddr.area,
        city: defaultAddr.city,
        postalCode: defaultAddr.postal_code,
      });
    }
  }, [addresses]);

  /* ---------------- TOTALS ---------------- */

  const totals = useCheckoutTotals({
    totalPrice,
  });

  /* ---------------- ORDER ---------------- */

  const order = useOrderPlacement({
    billing,
    shipping,
    payment,
    totals,
    clearCart,
    cart,
    user,
  });

  if (!totalItems) {
    return (
      <CheckoutGuard>
        <div className="container py-20 text-center text-textSecondary">
          Your cart is empty.
        </div>
      </CheckoutGuard>
    );
  }

  return (
    <CheckoutGuard>
      <div className="bg-gray-50 min-h-screen pb-10 pt-10">
        <div className="container max-w-6xl pt-6 pb-4">
          {/* Header */}
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">Checkout</h1>
              <p className="text-xs md:text-sm text-textSecondary">
                Complete your order in just a few simple steps.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-white px-3 py-1 shadow-sm border border-border">
              <Lock size={16} className="text-emerald-600" />
              <span className="text-xs font-medium text-gray-700">
                Secure checkout powered by ShoppersLink
              </span>
            </div>
          </div>

          <Stepper active={activeStep} />

          <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mt-2">
            <section className="space-y-6">
              <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
                {activeStep === 1 && (
                  <div className="space-y-4">
                    <AddressSelector
                      selectedAddressId={selectedAddress?.id}
                      onSelect={(addr) => {
                        setSelectedAddress(addr);

                        billing.onChange({
                          ...billing.value,
                          selectedAddressId: addr.id,
                          line1: addr.address_line1,
                          area: addr.area,
                          city: addr.city,
                          postalCode: addr.postal_code,
                        });
                      }}
                      onAddNew={() => setOpenAddressModal(true)}
                      onEdit={(addr) => {
                        setEditingAddress(addr);
                        setOpenAddressModal(true);
                      }}
                    />
                  </div>
                )}

                {activeStep === 2 && <ShippingOptions />}

                {activeStep === 3 && (
                  <PaymentOptions
                    value={payment.value}
                    onChange={payment.onChange}
                    errors={payment.errors}
                    options={payment.options}
                    registerValidate={(fn) => registerValidator("payment", fn)}
                  />
                )}

                {activeStep === 4 && (
                  <ReviewSection
                    billing={billing.value}
                    paymentId={payment.value}
                    cart={cart}
                    totals={totals}
                  />
                )}
              </div>

              <CheckoutFooterActions
                activeStep={activeStep}
                totalSteps={steps.length}
                goNext={goNext}
                goBack={goBack}
                placeOrder={order.placeOrder}
                loading={order.isPlacing}
              />
            </section>

            <OrderSummary totals={totals} />
          </div>
        </div>
      </div>

      {/* ADDRESS MODAL */}
      <AddressModal
        open={openAddressModal}
        onClose={() => {
          setOpenAddressModal(false);
          setEditingAddress(null);
        }}
        customerId={user?.customer?.id}
        mode={editingAddress ? "edit" : "add"}
        initialData={editingAddress}
      />
    </CheckoutGuard>
  );
}
