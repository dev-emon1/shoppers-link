"use client";

import { useState, useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import useCart from "@/modules/cart/hooks/useCart";
import MiniCartDrawer from "./MiniCartDrawer";

const toNumber = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

const CartIconButton = () => {
  const { totalItems } = useCart() || {};
  const [open, setOpen] = useState(false);

  // mounted flag to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  const count = toNumber(totalItems);

  // While not mounted, we force the visual to be "hidden" and empty,
  // so server HTML === initial client render HTML and hydration mismatch is avoided.
  const isVisuallyHidden = !mounted || count === 0;
  const showCount = mounted && count > 0;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open cart"
        className="relative flex items-center justify-center flex-col lg:flex-row lg:gap-1 hover:text-main group transition-all duration-200"
      >
        <div className="relative">
          <ShoppingCart
            size={22}
            className="text-gray-700 group-hover:text-main transition-colors"
          />

          {/* Keep SSR and initial client render identical by hiding until mounted.
              After mounted, show actual count if > 0. */}
          <span
            aria-hidden={isVisuallyHidden}
            className={
              "absolute -top-2 -right-2 bg-main text-white text-[10px] font-semibold rounded-full w-[18px] h-[18px] flex items-center justify-center shadow-md ring-2 ring-white " +
              (isVisuallyHidden
                ? "opacity-0 pointer-events-none"
                : "opacity-100")
            }
          >
            {showCount ? count : ""}
          </span>
        </div>

        <span className="hidden md:block text-[11px] font-medium tracking-wide group-hover:text-main text-textPrimary">
          Cart
        </span>
      </button>

      <MiniCartDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default CartIconButton;
