"use client";

export default function CheckoutFooterActions({
  activeStep,
  totalSteps,
  goNext,
  goBack,
  placeOrder,
  loading,
}) {
  const isLast = activeStep === totalSteps;

  return (
    <div className="flex items-center justify-between gap-3 mt-4">
      <button
        type="button"
        onClick={goBack}
        disabled={activeStep === 1}
        className="text-xs md:text-sm px-3 py-2 rounded-lg border border-border bg-white text-textSecondary disabled:opacity-50"
      >
        Back
      </button>

      {!isLast && (
        <button
          type="button"
          onClick={goNext}
          className="text-xs md:text-sm px-4 py-2 rounded-lg bg-main text-white hover:bg-main/90 transition"
        >
          Continue
        </button>
      )}

      {isLast && (
        <button
          type="button"
          onClick={placeOrder}
          disabled={loading}
          className="text-xs md:text-sm px-4 py-2 rounded-lg bg-main text-white hover:bg-main/90 transition disabled:opacity-60"
        >
          {loading ? "Placing order..." : "Place order"}
        </button>
      )}
    </div>
  );
}
