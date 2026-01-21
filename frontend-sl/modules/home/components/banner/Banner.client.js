"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import useBanners from "../../hooks/useBanners";
import { makeImageUrl } from "@/lib/utils/image";

export default function BannerClient() {
  const { banners, loading, error } = useBanners();

  const swiperConfig = useMemo(
    () => ({
      modules: [Autoplay, Pagination],
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: { clickable: true },
      loop: banners?.length > 1,
      className: "h-full",
    }),
    [banners?.length],
  );

  if (loading || error || !Array.isArray(banners) || banners.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full h-[80vh] overflow-hidden lg:mt-[26px]">
      <Swiper {...swiperConfig}>
        {banners.map((banner, index) => (
          <SwiperSlide key={banner.id}>
            {/* Background */}
            <div className="absolute inset-0">
              <Image
                src={makeImageUrl(banner.image)}
                alt={banner.title || "Promotional banner"}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-16 lg:px-24">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-4xl md:text-6xl font-semibold text-white max-w-[700px] leading-tight"
              >
                {banner.title}
              </motion.h1>

              {banner.description && (
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                  className="mt-4 text-lg md:text-xl text-gray-100 max-w-[550px]"
                >
                  {banner.description}
                </motion.p>
              )}

              {/* ✅ CTA restored */}
              {banner.cta_link && banner.cta_text && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8"
                >
                  <a
                    href={banner.cta_link}
                    className="inline-block px-8 py-3 bg-main text-white font-medium rounded-xl hover:bg-mainHover transition"
                  >
                    {banner.cta_text}
                  </a>
                </motion.div>
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
