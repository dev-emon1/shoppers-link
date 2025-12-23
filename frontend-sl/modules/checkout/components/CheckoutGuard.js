"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import useCart from "@/modules/cart/hooks/useCart";

export default function CheckoutGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  // ---- ALL HOOKS ALWAYS CALLED ----
  const { isAuthenticated } = useSelector((state) => state.auth || {});
  const { totalItems } = useCart();

  const [hydrated, setHydrated] = useState(false);
  const [triggerRedirect, setTriggerRedirect] = useState(false);

  // Ensure hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Decide if redirect needed
  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      setTriggerRedirect(true);
    }
  }, [hydrated, isAuthenticated]);

  // Redirect handler (separate, safe)
  useEffect(() => {
    if (triggerRedirect) {
      const redirectPath = encodeURIComponent(pathname || "/checkout");
      router.push(`/user/login?redirect=${redirectPath}`);
    }
  }, [triggerRedirect, pathname, router]);

  // ---- UI RENDER LOGIC (NO HOOKS BELOW THIS LINE) ----

  // Hydration still running
  if (!hydrated) {
    return (
      <div className="container py-16 text-center">
        <p className="text-textSecondary">Preparing your checkout...</p>
      </div>
    );
  }

  // Authentication missing (UI fallback)
  if (triggerRedirect) {
    return (
      <div className="container py-16 text-center">
        <p className="text-textSecondary mb-2">Redirecting to login…</p>
        <Link href="/user/login" className="text-main underline">
          Go to login →
        </Link>
      </div>
    );
  }

  // Cart empty?
  if (totalItems < 1) {
    return (
      <div className="container py-16 text-center">
        <p className="text-textSecondary mb-2">Your cart is empty.</p>
        <Link href="/" className="text-main underline">
          Continue shopping →
        </Link>
      </div>
    );
  }

  // All good → show checkout
  return children;
}
