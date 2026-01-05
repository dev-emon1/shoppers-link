"use client";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { TbCurrencyTaka } from "react-icons/tb";
import ProductActions from "../product/ProductActions";
import { makeImageUrl } from "@/lib/utils/image";

const CountdownTimer = ({ endsAt }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!endsAt) {
      setTimeLeft("");
      return;
    }

    const calculateTimeLeft = () => {
      const now = new Date();
      const endDate = new Date(endsAt.replace(" ", "T")); // Safe now because of null check above
      const difference = endDate - now;

      if (difference <= 0) return "Expired";

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endsAt]);

  if (!endsAt || !timeLeft) return null;

  return (
    <div className="mt-3 text-center">
      <span className="text-sm font-bold text-red">Ends in: {timeLeft}</span>
    </div>
  );
};

const Card = ({ data, href }) => {
  const productImage = makeImageUrl(data?.images?.[0]?.image_path || null);

  // Price & Discount
  const variant = data?.variants?.[0] || {};
  const price = parseFloat(variant.price) || 0;
  const discountAmount = parseFloat(variant.discount) || 0;
  const originalPrice = discountAmount > 0 ? price + discountAmount : null;

  const isITProduct = data?.category?.id === 8;
  const displayPrice =
    price > 0 ? price.toLocaleString("en-BD") : "Price on request";

  // Badge
  const badge = data?.featured?.badge_text || null;
  const badgeBg = data?.featured?.badge_color || null;

  return (
    <div className="group relative bg-bgSurface rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
      {badge && (
        <span
          className="absolute top-4 left-4 z-20 text-xs font-bold text-white px-4 py-1.5 rounded-full shadow-lg capitalize animate-pulse"
          style={{ backgroundColor: badgeBg || "#EF4444" }}
        >
          {badge}
        </span>
      )}

      <Link href={href || `/product/${data.slug || "#"}`}>
        <div className="relative w-full aspect-square overflow-hidden bg-white rounded-t-2xl">
          <Image
            src={productImage}
            alt={data?.name || "Product"}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className="object-contain p-6 group-hover:scale-110 transition-transform duration-500"
            loading="lazy" // Built-in lazy loading
            placeholder="blur"
            blurDataURL="/images/placeholder-blur.png" // Optional: create a low-res blur placeholder
            priority={false}
          />
        </div>
      </Link>

      <div className="p-5 text-center">
        <h3 className="text-sm font-semibold text-textPrimary line-clamp-1">
          {data.name}
        </h3>

        {/* Rating */}
        {data.avg_rating > 0 && data.total_reviews > 0 && (
          <div className="flex items-center justify-center gap-1 mt-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={16}
                className={
                  i < Math.round(data.avg_rating)
                    ? "fill-yellow text-yellow"
                    : "text-border"
                }
              />
            ))}
            <span className="text-sm text-textSecondary ml-1">
              {data.avg_rating.toFixed(1)} ({data.total_reviews})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mt-4">
          {isITProduct ? (
            <p className="text-sm font-semibold text-main">Call for Price</p>
          ) : price > 0 ? (
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl font-bold text-main flex items-center">
                <TbCurrencyTaka size={24} />
                {displayPrice}
              </p>

              {originalPrice && (
                <p className="text-base text-textSecondary line-through flex items-center">
                  <TbCurrencyTaka size={18} />
                  {originalPrice.toLocaleString("en-BD")}
                </p>
              )}
            </div>
          ) : (
            <p className="text-textSecondary">—</p>
          )}
        </div>

        {/* Countdown Timer */}
        <CountdownTimer endsAt={data?.featured?.ends_at} />
      </div>

      <ProductActions href={href} product={data} />
    </div>
  );
};

export default Card;
