"use client";
import React from "react";
import { Package, Zap, Shield, Star, Truck, Clock } from "lucide-react";

// Helper function
const toNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
};

// Smart Badge Component (JSX only)
const SmartBadge = ({ product }) => {
  const badges = [
    {
      show: product.is_new,
      label: "Just Launched",
      icon: <Clock className="w-3.5 h-3.5" />,
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      show: product.rating >= 4.5 && (product.total_reviews || 0) > 50,
      label: "Top Rated",
      icon: <Star className="w-3.5 h-3.5" />,
      color: "bg-purple-50 text-purple-700 border-purple-200",
    },
    {
      show: (product.sold_count || 0) > 500,
      label: "Best Seller",
      icon: <Zap className="w-3.5 h-3.5" />,
      color: "bg-orange-50 text-orange-700 border-orange-200",
    },
    {
      show: product.is_limited,
      label: "Limited Stock",
      icon: <Package className="w-3.5 h-3.5" />,
      color: "bg-red-50 text-red-700 border-red-200",
    },
    {
      show: product.free_shipping,
      label: "Free Delivery",
      icon: <Truck className="w-3.5 h-3.5" />,
      color: "bg-teal-50 text-teal-700 border-teal-200",
    },
    {
      show: product.warranty_years,
      label: `${product.warranty_years}Y Warranty`,
      icon: <Shield className="w-3.5 h-3.5" />,
      color: "bg-indigo-50 text-indigo-700 border-indigo-200",
    },
  ];

  const isITProduct = product?.category?.id === 8;

  const active = badges.find((b) => b.show);

  if (!active) {
    return (
      <span className="text-xs font-medium text-gray-500">
        Everyday Low Price
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold px-3 py-1.5 rounded-full text-sm border ${active.color}`}
    >
      {active.icon}
      {active.label}
    </span>
  );
};

// Main Component
// export default function ProductPriceBlock({ product, selectedVariant }) {
//   // Get price & old price
//   let price = null;
//   let oldPrice = null;

//   if (selectedVariant) {
//     price = toNumber(selectedVariant.price);
//     oldPrice = toNumber(selectedVariant.old_price);
//   } else if (product.variants && product.variants.length > 0) {
//     const v = product.variants[0];
//     price = toNumber(v.price);
//     oldPrice = toNumber(v.old_price);
//   } else {
//     price = toNumber(product.base_price);
//     oldPrice = toNumber(product.old_price);
//   }

//   // Calculate discount
//   const discount =
//     oldPrice && price && oldPrice > price
//       ? Math.round(((oldPrice - price) / oldPrice) * 100)
//       : 0;

//   // Format prices
//   const formattedPrice =
//     price != null ? `৳${price.toLocaleString("en-IN")}` : "—";

//   const formattedOldPrice =
//     oldPrice != null ? `৳${oldPrice.toLocaleString("en-IN")}` : null;

//   return (
//     <div className="flex flex-wrap items-center gap-3 mt-2">
//       {/* Main Price */}
//       <span className="text-3xl font-bold text-main whitespace-nowrap">
//         {formattedPrice}
//       </span>

//       {/* Old Price (strikethrough) */}
//       {formattedOldPrice && (
//         <span className="text-lg text-gray-500 line-through">
//           {formattedOldPrice}
//         </span>
//       )}

//       {/* Discount Badge or Smart Badge */}
//       {discount > 0 ? (
//         <span className="inline-flex items-center font-bold text-green-600 bg-green-50 px-4 py-2 rounded-full text-sm border border-green-200">
//           -{discount}% OFF
//         </span>
//       ) : (
//         <SmartBadge product={product} />
//       )}
//     </div>
//   );
// }

export default function ProductPriceBlock({ product, selectedVariant }) {
  const isITProduct = product?.category?.id === 8;

  // 🚫 IT Product → override everything
  if (isITProduct) {
    return (
      <div className="flex flex-wrap items-center gap-3 mt-2">
        <span className="text-2xl font-semibold text-main">Call for Price</span>

        <SmartBadge product={product} />
      </div>
    );
  }

  // ---------------- NORMAL PRODUCTS ----------------
  let price = null;
  let oldPrice = null;

  if (selectedVariant) {
    price = toNumber(selectedVariant.price);
    oldPrice = toNumber(selectedVariant.old_price);
  } else if (product.variants && product.variants.length > 0) {
    const v = product.variants[0];
    price = toNumber(v.price);
    oldPrice = toNumber(v.old_price);
  } else {
    price = toNumber(product.base_price);
    oldPrice = toNumber(product.old_price);
  }

  const discount =
    oldPrice && price && oldPrice > price
      ? Math.round(((oldPrice - price) / oldPrice) * 100)
      : 0;

  const formattedPrice =
    price != null ? `৳${price.toLocaleString("en-IN")}` : "—";

  const formattedOldPrice =
    oldPrice != null ? `৳${oldPrice.toLocaleString("en-IN")}` : null;

  return (
    <div className="flex flex-wrap items-center gap-3 mt-2">
      <span className="text-3xl font-bold text-main whitespace-nowrap">
        {formattedPrice}
      </span>

      {formattedOldPrice && (
        <span className="text-lg text-gray-500 line-through">
          {formattedOldPrice}
        </span>
      )}

      {discount > 0 ? (
        <span className="inline-flex items-center font-bold text-green-600 bg-green-50 px-4 py-2 rounded-full text-sm border border-green-200">
          -{discount}% OFF
        </span>
      ) : (
        <SmartBadge product={product} />
      )}
    </div>
  );
}
