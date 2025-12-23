"use client";
import React, { useState } from "react";
import { Heart, ShoppingBag, Eye } from "lucide-react";
import Link from "next/link";
import { showToast } from "@/lib/utils/toast";
import useCart from "@/modules/cart/hooks/useCart";
import useWishlist from "@/modules/wishlist/hooks/useWishlist";
import buildCartItemFromProduct from "@/modules/cart/utils/buildCartItemFromProduct";

const ProductActions = ({
  product,
  href,
  selectedVariantId = null,
  vendorId: passedVendorId = null,
  vendorName: passedVendorName = null,
}) => {
  const { add } = useCart();
  const { wishlist = [], toggle } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);

  // Wishlist active check (by product id)
  const active = Boolean(
    product && wishlist.some((p) => p?.id === product?.id)
  );

  const handleAddToCart = async () => {
    if (!product) return showToast("Product missing");
    if (!product.variants?.length) return showToast("No variants available"); // New check

    if (isAdding) return;

    // Build normalized cart item with fallbacks
    const item = buildCartItemFromProduct({
      product,
      variantId: selectedVariantId ?? product.variants[0]?.id ?? null, // Fallback to first variant
      quantity: 1,
      vendorId: passedVendorId ?? product?.vendor?.id ?? "default", // Fallback vendor ID
      vendorName:
        passedVendorName ??
        product?.vendor?.shop_name ??
        product?.vendor?.name ??
        "Unknown Vendor", // Enhanced fallback
    });

    if (!item) {
      return showToast("Could not add product to cart");
    }

    // Enhanced stock check: if defined and <=0, or null (assume out of stock)
    if (
      item.stock !== null &&
      (typeof item.stock === "number" ? item.stock <= 0 : true)
    ) {
      return showToast("This product is out of stock");
    }

    // Prepare payload
    const payload = {
      vendorId: item.vendorId,
      vendorName: item.vendorName,
      ...item,
    };

    try {
      setIsAdding(true);
      await add(payload);
      showToast(`${product.name} added to cart`);
    } catch (err) {
      console.error("Add to cart failed:", err);
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
    <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black/0 group-hover:bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300">
      <button
        onClick={handleWishlist}
        className={`bg-white p-2 rounded-full shadow ${
          active ? "text-red-500" : ""
        }`}
        aria-label="Toggle wishlist"
      >
        <Heart size={16} fill={active ? "currentColor" : "none"} />
      </button>

      <button
        onClick={handleAddToCart}
        className={`bg-white p-2 rounded-full shadow hover:bg-main hover:text-white transition ${
          isAdding ? "opacity-60 cursor-wait" : ""
        }`}
        aria-label="Add to cart"
        disabled={isAdding}
        title={isAdding ? "Adding..." : "Add to cart"}
      >
        <ShoppingBag size={16} />
      </button>

      <Link
        href={href || "#"}
        className="bg-white p-2 rounded-full shadow hover:bg-main hover:text-white transition"
        aria-label="View product"
      >
        <Eye size={16} />
      </Link>
    </div>
  );
};

export default ProductActions;
