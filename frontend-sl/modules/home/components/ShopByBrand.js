"use client";

import React, { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import { Store } from "lucide-react";

import useShopByBrands from "@/modules/home/hooks/useShopByBrands";
import { makeImageUrl } from "@/lib/utils/image";

const ShopByBrand = () => {
  const { data, status } = useShopByBrands();

  /**
   * ✅ Filter brands:
   * - link must exist
   * - link must be non-empty string
   */
  const brandsWithLink = useMemo(() => {
    if (!Array.isArray(data)) return [];
    return data.filter(
      (brand) => typeof brand.link === "string" && brand.link.trim().length > 0
    );
  }, [data]);

  /* ================= Loading ================= */
  if (status === "loading") {
    return (
      <section className="py-16 text-center text-sm text-textSecondary">
        Loading brands...
      </section>
    );
  }

  /* ================= Error / Empty ================= */
  if (status === "error" || !brandsWithLink.length) {
    return null;
  }

  return (
    <section className="py-16 bg-white border-t border-border">
      <div className="container">
        {/* ================= Header ================= */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-textPrimary">
            Shop by Brand
          </h2>
          <p className="text-textSecondary text-sm mt-2">
            Rule the world with your product
          </p>
          <div className="mt-3 w-20 h-1 bg-main mx-auto rounded-full" />
        </div>

        {/* ================= Brand Slider ================= */}
        <Swiper
          modules={[Autoplay]}
          spaceBetween={30}
          slidesPerView={2}
          breakpoints={{
            640: { slidesPerView: 3 },
            1024: { slidesPerView: 6 },
          }}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop
          speed={800}
        >
          {brandsWithLink.map((brand) => {
            const hasLogo = Boolean(brand.logo);

            return (
              <SwiperSlide key={brand.id}>
                <div className="flex justify-center">
                  <Link
                    href={brand.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
    group
    relative
    w-28 h-28
    rounded-full
    border border-border
    bg-bgPage
    flex items-center justify-center
    overflow-hidden        // ✅ KEY FIX
    hover:shadow-md
    transition
  "
                  >
                    {/* ================= Logo OR Icon ================= */}
                    {hasLogo ? (
                      <Image
                        src={makeImageUrl(brand.logo)}
                        alt={brand.shop_name}
                        width={80}
                        height={80}
                        className="object-contain opacity-80 group-hover:opacity-100 transition"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-textSecondary group-hover:text-main transition px-2">
                        <Store size={32} strokeWidth={1.5} />
                        <span className="mt-1 text-[11px] font-medium text-center line-clamp-2">
                          {brand.shop_name}
                        </span>
                      </div>
                    )}
                  </Link>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
};

export default ShopByBrand;
