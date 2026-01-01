"use client";

import { Lock } from "lucide-react";
import useCart from "@/modules/cart/hooks/useCart";

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

import { useSelector } from "react-redux";

export default function CheckoutPage() {
  // --- CART ---
  const { cart, totalItems, totalPrice, clear: clearCart } = useCart();
  // console.log(cart);

  // --- USER ---
  const user = useSelector((state) => state.auth.user);

  // --- CHECKOUT STEPS ---
  const steps = checkoutSteps;
  const { activeStep, goNext, goBack, registerValidator } = useCheckoutSteps();

  const billing = useBilling();
  const shipping = useShipping();
  const payment = usePayment();

  const totals = useCheckoutTotals({
    totalPrice,
    shippingId: shipping.value,
  });

  // --- ORDER PLACEMENT (SEND cart + user) ---
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

          {/* Stepper */}
          <Stepper active={activeStep} />

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-6 items-start mt-2">
            {/* Left: steps */}
            <section className="space-y-6">
              <div className="rounded-2xl border border-border bg-white p-4 md:p-5 shadow-sm">
                {activeStep === 1 && (
                  <BillingForm
                    value={billing.value}
                    errors={billing.errors}
                    onChange={billing.onChange}
                    hasSavedBilling={billing.hasSavedBilling}
                    onUseSaved={billing.useSavedBilling}
                    registerValidate={(fn) => registerValidator("billing", fn)}
                  />
                )}

                {activeStep === 2 && (
                  <ShippingOptions
                    value={shipping.value}
                    onChange={shipping.onChange}
                    errors={shipping.errors}
                    options={shipping.options}
                    registerValidate={(fn) => registerValidator("shipping", fn)}
                  />
                )}

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
                    shippingId={shipping.value}
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

            {/* Right: summary */}
            <OrderSummary totals={totals} />
          </div>
        </div>
      </div>
    </CheckoutGuard>
  );
}
