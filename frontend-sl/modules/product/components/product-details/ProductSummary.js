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
import { useDispatch } from "react-redux";
import useCart from "@/modules/cart/hooks/useCart";
import useWishlist from "@/modules/wishlist/hooks/useWishlist";
import { showToast } from "@/lib/utils/toast";
import buildCartItemFromProduct from "@/modules/cart/utils/buildCartItemFromProduct";

function parseAttributes(str) {
  try {
    return JSON.parse(str || "{}");
  } catch {
    return {};
  }
}
export default function ProductSummary({
  product,
  selectedVariant: externalSelectedVariant = null,
  onVariantSelect,
} = {}) {
  const dispatch = useDispatch();
  if (!product) return null;

  const { add } = useCart();
  const { wishlist = [], toggle } = useWishlist();
  const categoryId = product.category.id;
  // console.log(product.vendor.contact_number);

  const variants = useMemo(
    () =>
      Array.isArray(product.variants)
        ? product.variants.map((v) => ({
          ...v,
          attr: parseAttributes(v.attributes),
        }))
        : [],
    [product.variants]
  );

  const colors = useMemo(() => {
    const arr = [];
    variants.forEach((v) => {
      if (v.attr?.Color && !arr.includes(v.attr.Color)) arr.push(v.attr.Color);
    });
    return arr;
  }, [variants]);

  const sizes = useMemo(() => {
    const arr = [];
    variants.forEach((v) => {
      if (v.attr?.Size && !arr.includes(v.attr.Size)) arr.push(v.attr.Size);
    });
    return arr;
  }, [variants]);

  const [selectedColor, setSelectedColor] = useState(colors[0] ?? null);
  const [selectedSize, setSelectedSize] = useState(sizes[0] ?? null);
  const [qty, setQty] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (!selectedColor && colors.length) setSelectedColor(colors[0]);
    if (!selectedSize && sizes.length) setSelectedSize(sizes[0]);
  }, [colors.join("|"), sizes.join("|")]);

  useEffect(() => {
    if (!externalSelectedVariant) return;
    const attr =
      externalSelectedVariant.attr ??
      parseAttributes(externalSelectedVariant.attributes);
    if (attr?.Color) setSelectedColor(attr.Color);
    if (attr?.Size) setSelectedSize(attr.Size);
  }, [externalSelectedVariant?.id]);

  const selectedVariant = useMemo(() => {
    if (!variants.length) return null;
    return (
      variants.find((v) => {
        const c = v.attr?.Color ?? null;
        const s = v.attr?.Size ?? null;
        const colorOk = selectedColor ? c === selectedColor : true;
        const sizeOk = selectedSize ? s === selectedSize : true;
        return colorOk && sizeOk;
      }) ?? null
    );
  }, [variants, selectedColor, selectedSize]);

  useEffect(() => {
    if (typeof onVariantSelect === "function") {
      onVariantSelect(selectedVariant);
    }
  }, [selectedVariant?.id]);

  const handleAddToCart = async () => {
    if (!product) return showToast("Product missing");
    if (isAdding) return;

    // build normalized cart item
    const item = buildCartItemFromProduct({
      product,
      variantId: selectedVariant?.id ?? null,
      quantity: qty,
      vendorId: product?.vendor?.id ?? null,
      vendorName: product?.vendor?.shop_name ?? product?.vendor?.name ?? null,
    });
    // console.log(product);

    if (!item) {
      return showToast("Could not add product to cart");
    }

    // STOCK CHECK
    if (typeof item.stock === "number" && item.stock <= 0) {
      return showToast("This product is out of stock");
    }

    // prepare payload
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
    const active = Boolean(
      product && wishlist.some((p) => p?.id === product?.id)
    );
    toggle(product);
    showToast(active ? "Removed from wishlist" : "Added to wishlist");
  };

  const stock = selectedVariant?.stock ?? product.stock ?? null;
  const isOutOfStock = selectedVariant && stock !== null && stock <= 0;

  useEffect(() => {
    if (stock === 0) {
      setQty(1); // UI consistency (or 0 if you prefer)
    } else if (stock != null && qty > stock) {
      setQty(stock);
    } else if (stock != null && qty < 1) {
      setQty(1);
    }
  }, [stock]);


  const activeWishlist = Boolean(
    product && wishlist.some((p) => p?.id === product?.id)
  );

  // console.log(product?.reviews);
  // Ensure product.reviews is an array before processing
  const reviews = product?.reviews || [];

  // Calculate total reviews count
  const reviewsCount = reviews.length;

  // Calculate average: sum of ratings / count
  const rating = reviewsCount > 0
    ? reviews.reduce((acc, curr) => acc + Number(curr.rating), 0) / reviewsCount
    : 0;

  return (
    <div className="space-y-4">
      {/* Brand */}
      <div className="text-sm text-textLight font-semibold">
        {product.brand || ""}
      </div>
      {/* Title */}
      <h1 className="text-2xl font-semibold text-textPrimary leading-tight">
        {product.name}
      </h1>
      {/* Short Description */}
      {product.short_description && (
        <p className="text-sm text-gray-500 leading-relaxed">
          {product.short_description}
        </p>
      )}
      {/* Rating */}
      {categoryId !== 8 && (
        <div className="flex items-center gap-2 text-sm text-gray-800">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => {
              const starValue = i + 1;

              return (
                <Star
                  key={i}
                  size={16}
                  // If rating is 3.5:
                  // Stars 1, 2, 3 will be yellow.
                  // Star 4 will be gray (unless you implement a partial fill component)
                  className={`${starValue <= Math.round(rating)
                    ? "text-yellow fill-yellow"
                    : "text-gray-300 fill-transparent"
                    }`}
                />
              );
            })}

            <span className="text-sm font-medium ml-1">
              {rating > 0 ? rating.toFixed(1) : "0.0"}
            </span>

            <span className="text-xs text-muted-foreground ml-1">
              ({reviewsCount} {reviewsCount === 1 ? 'review' : 'reviews'})
            </span>
          </div>
        </div>
      )}
      {/* Price */}
      <ProductPriceBlock product={product} selectedVariant={selectedVariant} />

      {/* Color Swatches */}
      {colors.length > 0 && (
        <div>
          <h4 className="font-medium mb-3 text-lg">Color</h4>
          <div className="flex items-center gap-4 flex-wrap">
            {colors.map((colorName) => (
              <ColorSwatch
                key={colorName}
                value={colorName}
                selected={colorName === selectedColor}
                onClick={() => setSelectedColor(colorName)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Size options */}
      {sizes.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Size</h4>
          <div className="flex gap-2 flex-wrap">
            {sizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSize(s)}
                className={`px-3 py-1 rounded-md text-sm border ${s === selectedSize
                  ? "bg-main text-white border-main"
                  : "border-border bg-white"
                  }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity + Stock */}

      {categoryId !== 8 && (
        <>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm">Quantity</label>

              {stock !== null && stock <= 0 ? (
                <p className="text-red text-sm font-bold">Out of stock</p>
              ) : (
                <div className="flex items-center border rounded">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="px-3 py-1 text-lg"
                  >
                    -
                  </button>

                  <div className="px-4 select-none">{qty}</div>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() =>
                      setQty((q) =>
                        stock != null ? Math.min(stock, q + 1) : q + 1
                      )
                    }
                    className="px-3 py-1 text-lg"
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            {/* Stock info */}
            <div className="text-sm text-muted-foreground">
              {stock !== null && stock > 0
                ? `${stock} in stock`
                : stock === null
                  ? "Stock info not available"
                  : null}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-3">
            <button
              onClick={handleAddToCart}
              type="button"
              disabled={isAdding || isOutOfStock}
              className={`flex-1 px-4 py-3 flex items-center justify-center gap-2 transition
    ${isOutOfStock
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-main text-white hover:bg-main/90"}
    ${isAdding ? "opacity-60 cursor-wait" : ""}
  `}
            >
              <TbBasket size={18} />
              {isOutOfStock
                ? "Out of Stock"
                : isAdding
                  ? "Adding..."
                  : "Add to Cart"}
            </button>

            <button
              className="flex-1 bg-transparent text-main px-4 py-3 flex items-center justify-center gap-2 hover:bg-gray-300/90 transition border border-main"
              type="button"
              title="Add to Wishlist"
              onClick={handleWishlist}
              aria-pressed={activeWishlist}
            >
              <Heart
                size={18}
                fill={activeWishlist ? "currentColor" : "none"}
                className={activeWishlist ? "text-red-500" : ""}
              />
              {activeWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
            <ProductShippingInfo shipping={product.shipping} />
          </div>
        </>
      )}
      {categoryId == 8 && (
        <div className="flex flex-col gap-3 mt-3">
          <button
            className={`flex-1 bg-main text-white px-4 py-3 flex items-center justify-center gap-2 hover:bg-main/90 transition ${isAdding ? "opacity-60 cursor-wait" : ""
              }`}
            type="button"
          >
            <TbPhoneCall size={18} />
            {product.vendor?.contact_number}
          </button>
        </div>
      )
      }

      {/* Extra Info / widgets */}
      < ProductVendorInfo vendor={product.vendor} />
      <ProductWarranty warranty={product.warranty} />
      <ProductReturnPolicy returnPolicy={product.returnPolicy} />
      <ProductSocialShare product={product} />
    </div >
  );
}
