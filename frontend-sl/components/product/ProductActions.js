"use client";

import React, { useState } from "react";
import { Heart, ShoppingBag } from "lucide-react";

import { showToast } from "@/lib/utils/toast";
import useCart from "@/modules/cart/hooks/useCart";
import useWishlist from "@/modules/wishlist/hooks/useWishlist";
import buildCartItemFromProduct from "@/modules/cart/utils/buildCartItemFromProduct";

const ProductActions = ({
  product,
  isHovered = false,
  selectedVariantId = null,
  vendorId: passedVendorId = null,
  vendorName: passedVendorName = null,
}) => {
  const { add, cart } = useCart();

  const { wishlist = [], toggle } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);

  const active = Boolean(
    product && wishlist.some((p) => p?.id === product?.id)
  );

  const handleAddToCart = async () => {
    if (!product) return showToast("Product missing");
    if (!product.variants?.length) return showToast("No variants available");
    if (isAdding) return;

    const cartItems = Object.values(cart || {}).flatMap((v) => v.items || []);

    const item = buildCartItemFromProduct({
      product,
      variantId: selectedVariantId,
      quantity: 1,
      cartItems,
      vendorId: passedVendorId ?? product?.vendor?.id ?? "default",
      vendorName:
        passedVendorName ??
        product?.vendor?.shop_name ??
        product?.vendor?.name ??
        "Unknown Vendor",
    });

    if (!item) return showToast("Could not add product to cart");

    if (
      item.stock !== null &&
      (typeof item.stock === "number" ? item.stock <= 0 : true)
    ) {
      return showToast("This product is out of stock");
    }

    try {
      setIsAdding(true);
      await add({
        vendorId: item.vendorId,
        vendorName: item.vendorName,
        ...item,
      });
      showToast(`${product.name} added to cart`);
    } catch {
      showToast("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  const handleWishlist = () => {
    if (!product) return showToast("Product missing");
    toggle(product);
    showToast(active ? "Removed from wishlist" : "Added to wishlist");
  };

  return (
    <div>
      <div
        className={`
        absolute z-10
        top-1/2 right-2 -translate-y-1/2
        flex flex-col gap-2
        transition-all duration-200 ease-out

        ${
          isHovered
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-1 pointer-events-none"
        }
      `}
      >
        {product.category.id !== 8 && (
          <>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleWishlist();
              }}
              className={`flex items-center gap-1 bg-white px-2 py-1.5 rounded-full shadow text-xs ${
                active ? "text-red-500" : "text-textPrimary"
              }`}
              aria-label="Wishlist"
            >
              <Heart size={14} fill={active ? "currentColor" : "none"} />
              <span>Save</span>
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleAddToCart();
              }}
              disabled={isAdding}
              className={`flex items-center gap-1 bg-white px-2 py-1.5 rounded-full shadow text-xs ${
                isAdding ? "opacity-60 cursor-wait" : ""
              }`}
              aria-label="Add to cart"
            >
              <ShoppingBag size={14} />
              <span>Buy</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductActions;
