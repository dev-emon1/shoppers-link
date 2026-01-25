"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

const EmptyCart = () => (
  <div className="text-center py-24">
    <ShoppingBag className="mx-auto text-gray-400 mb-4" size={48} />
    <h2 className="text-lg font-semibold text-gray-600 mb-2">
      Your cart is empty 🛒
    </h2>
    <p className="text-gray-400 mb-6">
      Looks like you haven’t added anything yet.
    </p>
    <Link
      href="/"
      prefetch
      className="inline-block bg-main text-white px-6 py-2 rounded-lg hover:bg-main/90 transition"
    >
      Continue Shopping
    </Link>
  </div>
);

export default EmptyCart;
