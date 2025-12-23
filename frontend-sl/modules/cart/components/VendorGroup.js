"use client";

import CartItemCard from "./CartItemCard";

const VendorGroup = ({ vendorId, vendorData, onRemove, onQuantityChange }) => (
  <div className="bg-white rounded-xl shadow-sm border border-border/60 hover:shadow-md transition-all duration-300">
    <div className="p-4 border-b bg-gray-50 rounded-t-xl flex items-center justify-between">
      <h3 className="text-lg font-semibold text-textPrimary">
        🏬 {vendorData.vendorName || "Vendor"}
      </h3>
      <span className="text-sm text-textSecondary">
        {vendorData.items.length} item
        {vendorData.items.length > 1 && "s"}
      </span>
    </div>

    <div className="p-4">
      {vendorData.items.map((item) => (
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

export default VendorGroup;
