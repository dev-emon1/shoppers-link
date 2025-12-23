"use client";
export default function ProductVendorInfo({ vendor }) {
  if (!vendor) return null;
  const name = vendor.shop_name ?? vendor.name ?? "Official Store";
  return (
    <div className="border-t py-2 text-sm">
      <div className="font-medium text-black">
        Sold by: <span className="text-main font-semibold">{name}</span>
      </div>
      <div className="text-muted-foreground text-xs">
        {vendor.city ?? vendor.location ?? ""}{" "}
        {vendor.rating ? `| Rating: ${vendor.rating}★` : ""}
      </div>
      {vendor.verified && (
        <div className="text-green-600 text-xs mt-1">✓ Verified Seller</div>
      )}
    </div>
  );
}
