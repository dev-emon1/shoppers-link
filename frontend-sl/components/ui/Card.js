"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Star, Flame } from "lucide-react";
import { TbCurrencyTaka } from "react-icons/tb";

import ProductImageSlider from "../product/ProductImageSlider";
import ProductActions from "../product/ProductActions";

const Card = ({ data, href, showSoldCount = false }) => {
  const [isHovered, setIsHovered] = useState(false);

  const variant = data?.variants?.[0] || {};
  const price = Number(variant.price) || 0;
  const discountAmount = Number(variant.discount) || 0;
  const originalPrice = discountAmount > 0 ? price + discountAmount : null;

  const isITProduct = data?.category?.id === 8;
  const displayPrice =
    price > 0 ? price.toLocaleString("en-BD") : "Price on request";

  const soldCount =
    typeof data?.sold_count === "number" && data.sold_count > 0
      ? data.sold_count
      : null;

  return (
    <Link
      href={href || `/product/${data.slug}`}
      className="block bg-bgSurface border border-border overflow-hidden hover:shadow-xl transition-shadow"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative w-full aspect-square bg-white">
        <ProductImageSlider images={data?.images || []} isHovered={isHovered} />
        <ProductActions product={data} isHovered={isHovered} />
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        {/* Name */}
        <h3 className="text-sm font-semibold text-textPrimary line-clamp-1">
          {data.name}
        </h3>

        {/* Rating */}
        {data.avg_rating > 0 && (
          <div className="flex items-center gap-1 text-xs">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className={
                  i < Math.round(data.avg_rating)
                    ? "fill-yellow text-yellow"
                    : "text-border"
                }
              />
            ))}
            <span className="text-textSecondary ml-1">
              ({data.total_reviews})
            </span>
          </div>
        )}

        {/* Price + Sold */}
        <div className="mt-1 space-y-1">
          {isITProduct ? (
            <span className="text-sm font-semibold text-main">
              Call for Price
            </span>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-main flex items-center">
                  <TbCurrencyTaka size={18} />
                  {displayPrice}
                </span>

                {originalPrice && (
                  <span className="text-xs text-textSecondary line-through">
                    ৳{originalPrice.toLocaleString("en-BD")}
                  </span>
                )}
              </div>

              {showSoldCount && soldCount && (
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-50 text-orange-600 text-[11px] font-medium w-fit">
                  <Flame size={12} />
                  <span>{soldCount}+ sold</span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </Link>
  );
};

export default Card;
