"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import api, { IMAGE_URL } from "@/core/api/axiosClient";

const PromoBanner = ({ position = "middle-banner" }) => {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        setLoading(true);
        // Using the route: /banners/{position?}
        const res = await api.get(`/banners/${position}`);
        // If your Resource returns a collection, take the first item
        const data = res.data.data;
        // console.log(data);

        setBanner(Array.isArray(data) ? data[0] : data);
      } catch (err) {
        console.error("Failed to fetch banner:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBanner();
  }, [position]);

  if (loading || !banner) return null; // Or a skeleton loader

  return (
    <section className="relative w-full py-8 md:py-16">
      <div className="container relative overflow-hidden rounded-2xl">
        <div className="relative w-full h-[260px] sm:h-[320px] md:h-[440px] lg:h-[520px] rounded-2xl overflow-hidden">
          <Image
            // 1. Updated from item.image to item.image_path
            src={banner.image_path?.startsWith("http")
              ? banner.image_path
              : `${IMAGE_URL}${banner.image_path}`}
            alt={banner.title}
            fill
            priority
            className="object-cover object-center scale-[1.02] hover:scale-[1.06] transition-transform duration-[2500ms]"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 md:via-black/40 to-transparent" />

          <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8 md:px-14 lg:px-24 text-white">
            <h3 className="uppercase text-[10px] sm:text-xs md:text-sm tracking-[3px] md:tracking-[6px] text-gray-300 mb-2 sm:mb-3">
              {/* 2. Updated from banner.sub_title to banner.subtitle */}
              {banner.subtitle}
            </h3>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-snug max-w-xs sm:max-w-md md:max-w-2xl mb-2 sm:mb-4">
              {banner.title}
            </h1>

            <p className="text-[11px] sm:text-sm md:text-base text-gray-200 max-w-[90%] sm:max-w-lg md:max-w-xl mb-4 sm:mb-6">
              {banner.description}
            </p>

            {/* 3. Updated from banner.link to banner.button_link */}
            {banner.button_link && (
              <Link
                href={banner.button_link}
                className="w-fit bg-main hover:bg-mainHover text-[11px] sm:text-sm md:text-base px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-md font-semibold transition-all shadow-lg"
              >
                {/* 4. Updated from banner.button_text */}
                {banner.button_text} →
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;