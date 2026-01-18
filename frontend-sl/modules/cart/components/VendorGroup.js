"use client";

import Image from "next/image";
import { Store } from "lucide-react";
import CartItemCard from "./CartItemCard";
import { makeImageUrl } from "@/lib/utils/image";

const VendorGroup = ({ vendorId, vendorData, onRemove, onQuantityChange }) => {
  // 🔹 Vendor logo resolve
  const rawLogo =
    vendorData?.logo ?? vendorData?.shop_logo ?? vendorData?.image ?? null;

  const logoSrc = rawLogo ? makeImageUrl(rawLogo) : null;

  return (
    <div className="bg-white shadow-sm border border-border/60 transition-all duration-300">
      {/* Header */}
      <div className="p-4 border-b bg-gray-50 rounded-t-xl flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {/* Vendor Logo / Icon */}
          <div className="relative w-8 h-8 flex-shrink-0 rounded-md bg-white border overflow-hidden flex items-center justify-center">
            {logoSrc ? (
              <Image
                src={logoSrc}
                alt={vendorData?.vendorName || "Vendor logo"}
                width={32}
                height={32}
                className="object-contain"
                unoptimized
              />
            ) : (
              <Store size={18} className="text-gray-500" />
            )}
          </div>

          {/* Vendor Name */}
          <h3 className="text-lg font-semibold text-textPrimary truncate">
            {vendorData?.vendorName || "Vendor"}
          </h3>
        </div>

        {/* Item Count */}
        <span className="text-sm text-textSecondary">
          {vendorData?.items?.length || 0} item
          {vendorData?.items?.length > 1 && "s"}
        </span>
      </div>

      {/* Items */}
      <div className="p-4">
        {vendorData?.items?.map((item) => (
          <CartItemCard
            key={`${item.id}-${item.variantId || "default"}`}
            item={item}
            vendorId={vendorId}
            onRemove={onRemove}
            onQuantityChange={onQuantityChange}
          />
        ))}
      </div>
    </div>
  );
};

export default VendorGroup;
