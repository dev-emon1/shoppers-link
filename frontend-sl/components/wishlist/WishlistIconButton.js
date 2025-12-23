// components/wishlist/WishlistIconButton.js
"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import WishlistDrawer from "./WishlistDrawer";
import useWishlist from "@/modules/wishlist/hooks/useWishlist";

const WishlistIconButton = () => {
  const { wishlist } = useWishlist();
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open Wishlist"
        className="relative flex items-center justify-center flex-col lg:flex-row lg:gap-1 hover:text-main group transition-all duration-200"
      >
        <Heart
          size={20}
          className={`transition ${
            wishlist.length > 0 ? "fill-main text-main" : ""
          }`}
        />

        <span className="sm:block text-[10px] lg:text-sm font-medium text-textPrimary group-hover:text-main">
          Wishlist
        </span>

        {wishlist.length > 0 && (
          <span
            className="absolute -top-2 left-2 bg-main text-white text-[10px] 
            font-semibold rounded-full w-5 h-5 flex items-center justify-center
            shadow-md ring-2 ring-white"
          >
            {wishlist.length}
          </span>
        )}
      </button>

      <WishlistDrawer open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default WishlistIconButton;
