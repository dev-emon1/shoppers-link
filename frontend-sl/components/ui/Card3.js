// modules/product/components/Card3.js
"use client";
import React from "react";
import Image from "next/image";
import ProductActions from "../product/ProductActions";
import Link from "next/link";
import { makeImageUrl } from "@/lib/utils/image";

const Card3 = ({
  product: fullProduct,
  imageSrc = "/images/product-placeholder.jpg",
  isNew = false,
  discount = 0,
  name = "Product Name",
  slug = "",
  vendorId = "vendor-1",
  vendorName = "Official Store",
  rating = 0,
  price = null,
  oldPrice = null,
  category = "",
  href,
}) => {
  const hasBadge = isNew || Number(discount) > 0;
  const badgeText = isNew ? "NEW" : Number(discount) > 0 ? `-${discount}%` : "";
  const badgeClass = isNew ? "bg-green" : Number(discount) > 0 ? "bg-red" : "";

  const isITProduct = fullProduct?.category?.id === 8;

  // numeric safe conversion
  const numericPrice =
    price !== null && price !== undefined && !Number.isNaN(Number(price))
      ? Number(price)
      : null;
  const numericOldPrice =
    oldPrice !== null &&
    oldPrice !== undefined &&
    !Number.isNaN(Number(oldPrice))
      ? Number(oldPrice)
      : null;

  return (
    <div
      className="
        group relative bg-white border border-border rounded-2xl 
        overflow-hidden shadow-sm hover:shadow-md 
        transition-all duration-300 w-full sm:w-[95%] md:w-full
      "
    >
      {hasBadge && (
        <span
          className={`absolute top-3 left-3 z-20 text-xs font-semibold text-white px-3 py-1 rounded-md ${badgeClass}`}
        >
          {badgeText}
        </span>
      )}

      <div className="relative w-full h-64 overflow-hidden">
        <Image
          src={makeImageUrl(imageSrc)}
          alt={name || "Product"}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-contain p-2 group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          placeholder="blur"
          blurDataURL="/images/placeholder-blur.png"
          priority={false}
          unoptimized
        />

        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-all duration-300">
          <ProductActions
            slug={slug}
            product={fullProduct}
            vendorId={vendorId}
            vendorName={vendorName}
            href={href}
          />
        </div>
      </div>

      <Link href={href || "#"} className="p-2 text-center block">
        <h3 className="font-semibold text-textPrimary text-sm md:text-base line-clamp-1 p-1">
          {name}
        </h3>

        {category && <p className="text-textLight text-xs mt-1">{category}</p>}

        <div className="mt-3">
          {isITProduct ? (
            <span className="text-sm font-semibold text-main">
              Call for Price
            </span>
          ) : numericPrice !== null ? (
            <>
              <span className="text-lg font-bold text-main">
                ৳{numericPrice.toLocaleString()}
              </span>

              {numericOldPrice !== null && (
                <span className="text-xs text-textLight line-through ml-2">
                  ৳{numericOldPrice.toLocaleString()}
                </span>
              )}
            </>
          ) : (
            <span className="text-textLight">—</span>
          )}
        </div>
      </Link>
    </div>
  );
};

export default Card3;
