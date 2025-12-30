// components/cart/CartItemCard.js
"use client";

import Image from "next/image";
import { Trash2 } from "lucide-react";
import { normalizeImage, getImageSrc } from "@/modules/cart/utils/image";
import { toNumber } from "@/modules/cart/utils/utils";

const DEFAULT_MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_BASE || "http://localhost:8000";

const CartItemCard = ({ item, vendorId, onRemove, onQuantityChange }) => {
  const currentQty = Number(item.quantity) || 1;
  const stock = Number(item.stock) || 10;

  // prefer item.images[0], then item.image (string), then try rawProduct images
  const rawImageCandidate =
    item?.images?.[0] ?? item?.image ?? item?.rawProduct?.images?.[0];
  let imageSrc = normalizeImage(rawImageCandidate, DEFAULT_MEDIA_BASE);

  // If normalizeImage returned a relative path (rare), build absolute using MEDIA_BASE
  if (imageSrc && !/^https?:\/\//i.test(imageSrc)) {
    // ensure single leading slash
    const cleaned = imageSrc.replace(/^\/+/, "");
    imageSrc = `${DEFAULT_MEDIA_BASE.replace(/\/$/, "")}/storage/${cleaned}`;
  }
  // console.log(item);

  // Final fallback
  if (!imageSrc) imageSrc = "/images/placeholder.png";

  const handleDecrease = () => {
    if (currentQty <= 1) return;
    onQuantityChange?.({
      vendorId,
      productId: item.id,
      variantId: item.variantId,
      quantity: currentQty - 1,
    });
  };

  const handleIncrease = () => {
    if (currentQty >= stock) return;
    onQuantityChange?.({
      vendorId,
      productId: item.id,
      variantId: item.variantId,
      quantity: currentQty + 1,
    });
  };

  const handleRemove = () => {
    onRemove?.({
      vendorId,
      productId: item.id,
      variantId: item.variantId,
    });
  };

  const priceNumber = toNumber(item.price);
  const totalLine = (priceNumber * currentQty).toFixed(2);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-3 border border-border rounded-lg p-3 mb-3 bg-white hover:shadow-sm transition">
      {/* Product Info */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
          {/* width/height provided (next/image needs numeric values)
              - use objectFit via className
              - use priority if desirable for cart images */}
          <Image
            src={imageSrc}
            alt={item.name ?? "Product image"}
            width={64}
            height={64}
            className="object-contain rounded-md"
          // If you're using external domains and haven't configured them, you can
          // temporarily add unoptimized prop for dev: unoptimized
          // unoptimized
          />
        </div>

        <div className="w-full min-w-0">
          <h4 className="font-semibold text-sm text-textPrimary truncate">
            {item.name} <span>{item.sku}</span>
          </h4>
          <p className="text-xs text-gray-500 mt-[2px]">
            ৳{priceNumber.toFixed(2)}
          </p>
          <p className="text-[11px] text-gray-400">
            In stock: {Math.max(0, stock - currentQty)}
          </p>
        </div>
      </div>

      {/* Quantity + Price + Remove */}
      <div className="flex items-center justify-between sm:justify-end gap-3 flex-shrink-0 w-full sm:w-auto">
        {/* Quantity Controls */}
        <div className="flex items-center border rounded-lg overflow-hidden">
          <button
            disabled={currentQty <= 1}
            onClick={handleDecrease}
            className={`px-2 sm:px-3 py-[2px] text-sm ${currentQty <= 1
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-gray-100"
              }`}
            aria-label="Decrease quantity"
          >
            −
          </button>

          <span className="px-2 sm:px-3 text-sm font-medium" aria-live="polite">
            {currentQty}
          </span>

          <button
            disabled={currentQty >= stock}
            onClick={handleIncrease}
            className={`px-2 sm:px-3 py-[2px] text-sm ${currentQty >= stock
              ? "opacity-40 cursor-not-allowed"
              : "hover:bg-gray-100"
              }`}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>

        {/* Price */}
        <span className="font-semibold text-main w-16 text-right text-sm sm:text-base">
          ৳{totalLine}
        </span>

        {/* Remove */}
        <button
          onClick={handleRemove}
          className="text-red-500 hover:text-red-700 flex-shrink-0"
          aria-label="Remove item"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
};

export default CartItemCard;
