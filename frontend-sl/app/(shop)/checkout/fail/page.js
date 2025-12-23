"use client";
import Link from "next/link";

const CheckoutFailPage = () => {
  return (
    <section className="container py-16 min-h-screen text-center">
      <h1 className="text-3xl font-bold text-red-600 mb-4">
        ❌ Payment Failed
      </h1>
      <p className="text-gray-600 mb-8">
        Unfortunately, your payment could not be processed. Please try again or
        use another payment method.
      </p>

      <div className="flex justify-center gap-4">
        <Link
          href="/checkout"
          className="bg-main text-white px-6 py-2 rounded-lg hover:bg-main/90 transition"
        >
          Retry Payment
        </Link>
        <Link
          href="/"
          className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50 transition"
        >
          Back to Home
        </Link>
      </div>
    </section>
  );
};

export default CheckoutFailPage;
