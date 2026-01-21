"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { TbCurrencyTaka } from "react-icons/tb";
import ProductActions from "@/components/product/ProductActions";

const ProductsList = ({ products = [] }) => {
  if (!products.length) return null;
  // console.log(products);

  const buildImage = (p) => {
    if (Array.isArray(p.images) && p.images.length > 0) {
      const img = p.images[0];
      if (img.image_path) {
        return `${process.env.NEXT_PUBLIC_MEDIA_BASE}/storage/${img.image_path}`;
      }
      if (typeof img === "string") return img;
    }
    return "/images/product-placeholder.jpg";
  };

  const buildHref = (p) =>
    `/${[p.category?.slug, p.sub_category?.slug, p.child_category?.slug, p.slug]
      .filter(Boolean)
      .join("/")}`;

  return (
    <div className="space-y-4">
      {products.map((p) => {
        const variant = p.variants?.[0] || {};
        const price = Number(variant.price || p.price || 0);
        const discount = Number(variant.discount || 0);
        const oldPrice = discount ? price + discount : null;

        return (
          <div
            key={p.id}
            className="
              flex flex-col sm:flex-row gap-4
              bg-white border border-border rounded-lg p-4
              hover:shadow-md transition
            "
          >
            {/* Image */}
            <Link
              href={buildHref(p)}
              prefetch
              className="relative w-full sm:w-40 h-40 shrink-0"
            >
              <Image
                src={buildImage(p)}
                alt={p.name}
                fill
                className="object-contain"
              />
            </Link>

            {/* Middle Info */}
            <div className="flex-1">
              <Link href={buildHref(p)} prefetch>
                <h3 className="font-semibold text-textPrimary hover:text-main transition">
                  {p.name}
                </h3>
              </Link>

              {p.category?.name && (
                <p className="text-sm text-textLight mt-1">{p.category.name}</p>
              )}

              {/* Rating */}
              {p.avg_rating > 0 && (
                <div className="flex items-center gap-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.round(p.avg_rating)
                          ? "fill-yellow text-yellow"
                          : "text-border"
                      }
                    />
                  ))}
                  <span className="text-xs text-textLight ml-1">
                    {p.avg_rating.toFixed(1)}
                  </span>
                </div>
              )}
            </div>

            {/* Right Info */}
            <div className="sm:w-44 flex flex-col items-start sm:items-end justify-between">
              {/* Price */}
              <div className="text-left sm:text-right">
                {price ? (
                  <>
                    <p className="text-lg font-bold text-main flex items-center justify-end gap-1">
                      <TbCurrencyTaka />
                      {price.toLocaleString()}
                    </p>
                    {oldPrice && (
                      <p className="text-sm text-textLight line-through">
                        ৳{oldPrice.toLocaleString()}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-textLight">Price on request</p>
                )}
              </div>

              {/* Actions */}
              <div className="mt-3 sm:mt-0">
                <ProductActions product={p} href={buildHref(p)} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProductsList;
