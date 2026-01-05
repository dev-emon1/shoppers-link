"use client";

import React, { useState, useMemo, useEffect } from "react";

import ProductPriceBlock from "./ProductPriceBlock";
import ProductShippingInfo from "./ProductShippingInfo";
import ProductVendorInfo from "./ProductVendorInfo";
import ProductWarranty from "./ProductWarranty";
import ProductReturnPolicy from "./ProductReturnPolicy";
import ProductSocialShare from "./ProductSocialShare";

import ColorSwatch from "../../utils/colorSwatch";

import { Heart, Star } from "lucide-react";
import { TbBasket, TbPhoneCall } from "react-icons/tb";

import useCart from "@/modules/cart/hooks/useCart";
import useWishlist from "@/modules/wishlist/hooks/useWishlist";
import { showToast } from "@/lib/utils/toast";
import buildCartItemFromProduct from "@/modules/cart/utils/buildCartItemFromProduct";

/* ----------------------------------
   Helpers
---------------------------------- */
function parseAttributes(str) {
  try {
    return JSON.parse(str || "{}");
  } catch {
    return {};
  }
}

/* ----------------------------------
   Component
---------------------------------- */
export default function ProductSummary({ product, onVariantSelect } = {}) {
  if (!product) return null;

  const { add, cart } = useCart();
  const { wishlist = [], toggle } = useWishlist();

  const categoryId = product?.category?.id;

  /* ----------------------------------
     Variants normalization
  ---------------------------------- */
  const variants = useMemo(() => {
    if (!Array.isArray(product.variants)) return [];
    return product.variants.map((v) => ({
      ...v,
      attr: parseAttributes(v.attributes),
    }));
  }, [product.variants]);

  /* ----------------------------------
     Attribute options
  ---------------------------------- */
  const colors = useMemo(() => {
    const set = new Set();
    variants.forEach((v) => v.attr?.Color && set.add(v.attr.Color));
    return Array.from(set);
  }, [variants]);

  const sizes = useMemo(() => {
    const set = new Set();
    variants.forEach((v) => v.attr?.Size && set.add(v.attr.Size));
    return Array.from(set);
  }, [variants]);

  /* ----------------------------------
     UI State
  ---------------------------------- */
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  /* ----------------------------------
     Default selection (first load only)
  ---------------------------------- */
  useEffect(() => {
    if (!selectedColor && colors.length) setSelectedColor(colors[0]);
    if (!selectedSize && sizes.length) setSelectedSize(sizes[0]);
  }, [colors, sizes]);

  /* ----------------------------------
     Resolve selected variant
  ---------------------------------- */
  const selectedVariant = useMemo(() => {
    if (!variants.length) return null;

    return (
      variants.find((v) => {
        const colorOk = selectedColor ? v.attr?.Color === selectedColor : true;
        const sizeOk = selectedSize ? v.attr?.Size === selectedSize : true;
        return colorOk && sizeOk;
      }) ?? null
    );
  }, [variants, selectedColor, selectedSize]);

  /* ----------------------------------
     Notify parent (gallery sync)
  ---------------------------------- */
  useEffect(() => {
    if (typeof onVariantSelect === "function") {
      onVariantSelect(selectedVariant);
    }
  }, [selectedVariant?.id]);

  /* ----------------------------------
     Stock & Quantity safety
  ---------------------------------- */
  const stock = selectedVariant?.stock ?? product.stock ?? null;
  const isOutOfStock = stock !== null && stock <= 0;

  useEffect(() => {
    if (stock === 0) {
      setQty(1);
    } else if (stock != null && qty > stock) {
      setQty(stock);
    } else if (qty < 1) {
      setQty(1);
    }
  }, [stock]);

  /* ----------------------------------
     Cart logic
  ---------------------------------- */
  const handleAddToCart = async () => {
    if (isAdding) return;

    const vendorId = product?.vendor?.id ?? null;
    const cartItems = cart?.[vendorId]?.items ?? [];

    const existingQty = cartItems
      .filter(
        (i) =>
          String(i.productId) === String(product.id) &&
          String(i.variantId) === String(selectedVariant?.id)
      )
      .reduce((sum, i) => sum + Number(i.quantity || 0), 0);

    if (stock <= 0) {
      return showToast("This product is out of stock");
    }

    if (existingQty + qty > stock) {
      return showToast(
        `Only ${Math.max(0, stock - existingQty)} item(s) left in stock`
      );
    }

    const item = buildCartItemFromProduct({
      product,
      variantId: selectedVariant?.id ?? null,
      quantity: qty,
      vendorId,
      vendorName: product?.vendor?.shop_name ?? product?.vendor?.name ?? null,
    });

    if (!item) return showToast("Could not add product to cart");

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

  /* ----------------------------------
     Wishlist
  ---------------------------------- */
  const isWishlisted = wishlist.some((p) => p?.id === product?.id);

  const handleWishlist = () => {
    toggle(product);
    showToast(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  /* ----------------------------------
     Reviews
  ---------------------------------- */
  const reviews = product?.reviews || [];
  const reviewsCount = reviews.length;
  const rating =
    reviewsCount > 0
      ? reviews.reduce((a, r) => a + Number(r.rating || 0), 0) / reviewsCount
      : 0;

  /* ----------------------------------
     Render
  ---------------------------------- */
  return (
    <div className="space-y-4">
      {/* Brand */}
      {product.brand && (
        <div className="text-sm text-textLight font-semibold">
          {product.brand}
        </div>
      )}

      {/* Title */}
      <h1 className="text-2xl font-semibold text-textPrimary">
        {product.name}
      </h1>

      {/* Short Description */}
      {product.short_description && (
        <p className="text-sm text-gray-500">{product.short_description}</p>
      )}

      {/* Rating */}
      {categoryId !== 8 && (
        <div className="flex items-center gap-2 text-sm">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={16}
              className={
                i + 1 <= Math.round(rating)
                  ? "text-yellow fill-yellow"
                  : "text-gray-300"
              }
            />
          ))}
          <span>{rating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">
            ({reviewsCount} reviews)
          </span>
        </div>
      )}

      {/* Price */}
      <ProductPriceBlock product={product} selectedVariant={selectedVariant} />

      {/* Color */}
      {colors.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Color</h4>
          <div className="flex gap-3 flex-wrap">
            {colors.map((c) => (
              <ColorSwatch
                key={c}
                value={c}
                selected={c === selectedColor}
                onClick={() => setSelectedColor(c)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size */}
      {sizes.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Size</h4>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((s) => (
              <button
                key={s}
                onClick={() => setSelectedSize(s)}
                className={`px-3 py-1 text-sm rounded border ${
                  s === selectedSize
                    ? "bg-main text-white border-main"
                    : "bg-white border-border"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity & Actions */}
      {categoryId !== 8 ? (
        <>
          <div className="flex items-center gap-4">
            <div className="flex items-center border rounded">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))}>
                -
              </button>
              <span className="px-4">{qty}</span>
              <button
                onClick={() =>
                  setQty((q) => (stock ? Math.min(stock, q + 1) : q + 1))
                }
              >
                +
              </button>
            </div>

            {stock !== null && (
              <span className="text-sm text-muted-foreground">
                {stock > 0 ? `${stock} in stock` : "Out of stock"}
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdding || isOutOfStock}
            className={`w-full py-3 flex items-center justify-center gap-2 ${
              isOutOfStock
                ? "bg-gray-400"
                : "bg-main text-white hover:bg-main/90"
            }`}
          >
            <TbBasket size={18} />
            {isOutOfStock
              ? "Out of Stock"
              : isAdding
              ? "Adding..."
              : "Add to Cart"}
          </button>

          <button
            onClick={handleWishlist}
            className="w-full border border-main text-main py-3 flex items-center justify-center gap-2"
          >
            <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
            {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>

          <ProductShippingInfo shipping={product.shipping} />
        </>
      ) : (
        <button className="w-full bg-main text-white py-3 flex items-center justify-center gap-2">
          <TbPhoneCall size={18} />
          {product.vendor?.contact_number}
        </button>
      )}

      {/* Extra */}
      <ProductVendorInfo vendor={product.vendor} />
      <ProductWarranty warranty={product.warranty} />
      <ProductReturnPolicy returnPolicy={product.returnPolicy} />
      <ProductSocialShare product={product} />
    </div>
  );
}
