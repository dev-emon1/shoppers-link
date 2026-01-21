"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import api from "@/core/api/axiosClient";
import { makeImageUrl } from "@/lib/utils/image";
import {
  readPromoBanner,
  writePromoBanner,
} from "@/modules/home/utils/promoBannerCache";

export default function PromoBannerClient({ position = "middle-banner" }) {
  const [banner, setBanner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const fetchBanner = async () => {
      // 1️⃣ Session cache (instant)
      const cached = readPromoBanner(position);
      if (cached) {
        if (mounted) {
          setBanner(cached);
          setLoading(false);
        }
        return;
      }

      try {
        const res = await api.get(`/banners/${position}`);
        const data = res?.data?.data;
        const bannerData = Array.isArray(data) ? data[0] : data;

        if (mounted && bannerData) {
          setBanner(bannerData);
          writePromoBanner(position, bannerData); // cache save
        }
      } catch (err) {
        console.error("Failed to fetch promo banner:", err);
      } finally {
        mounted && setLoading(false);
      }
    };

    fetchBanner();

    return () => {
      mounted = false;
    };
  }, [position]);

  // ⛔ Never block UI unnecessarily
  if (loading && !banner) return null;
  if (!banner) return null;

  return (
    <section className="relative w-full py-8 md:py-16">
      <div className="container relative overflow-hidden rounded-2xl">
        <div className="relative w-full h-[260px] sm:h-[320px] md:h-[440px] lg:h-[520px] rounded-2xl overflow-hidden">
          {/* Background image */}
          <Image
            src={makeImageUrl(banner.image_path)}
            alt={banner.title || "Promotional banner"}
            fill
            sizes="100vw"
            className="object-cover object-center scale-[1.02] hover:scale-[1.06] transition-transform duration-[2500ms]"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 md:via-black/40 to-transparent" />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8 md:px-14 lg:px-24 text-white">
            {banner.subtitle && (
              <h3 className="uppercase text-[10px] sm:text-xs md:text-sm tracking-[3px] md:tracking-[6px] text-gray-300 mb-2 sm:mb-3">
                {banner.subtitle}
              </h3>
            )}

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-snug max-w-xs sm:max-w-md md:max-w-2xl mb-2 sm:mb-4">
              {banner.title}
            </h1>

            {banner.description && (
              <p className="text-[11px] sm:text-sm md:text-base text-gray-200 max-w-[90%] sm:max-w-lg md:max-w-xl mb-4 sm:mb-6">
                {banner.description}
              </p>
            )}

            {/* CTA */}
            {banner.button_link && banner.button_text && (
              <Link
                href={banner.button_link}
                prefetch
                className="w-fit bg-main hover:bg-mainHover text-[11px] sm:text-sm md:text-base px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-md font-semibold transition-all shadow-lg"
              >
                {banner.button_text} →
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
