"use client";
// Marks this component as a Client Component (required for Swiper & hooks)

import React from "react";
// React core import

import Image from "next/image";
// Next.js optimized Image component for performance

import { Swiper, SwiperSlide } from "swiper/react";
// Swiper core components

import { Autoplay } from "swiper/modules";
// Swiper module for automatic sliding

import Link from "next/link";
// Next.js Link component for navigation

import { brandData } from "@/data/brandData";
// Static brand data (logo, name, link)

const ShopByBrand = () => {
  return (
    // Main section wrapper
    <section className="py-16 bg-white border-t border-border">
      <div className="container">
        {/* ================= Section Header ================= */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-textPrimary mb-2">
            Shop by Brand
          </h2>

          <p className="text-textSecondary text-sm max-w-md mx-auto">
            Rule the world with your product
          </p>

          {/* Decorative underline */}
          <div className="mt-3 w-20 h-1 bg-main mx-auto rounded-full"></div>
        </div>

        {/* ================= Brand Slider ================= */}
        <Swiper
          modules={[Autoplay]} // Enable autoplay functionality
          spaceBetween={30} // Space between slides
          slidesPerView={2} // Default slides per view (mobile)
          breakpoints={{
            640: { slidesPerView: 3 }, // Tablets
            1024: { slidesPerView: 6 }, // Desktop
          }}
          autoplay={{
            delay: 2000, // Slide every 2 seconds
            disableOnInteraction: false, // Continue autoplay after interaction
            pauseOnMouseEnter: true, // Pause autoplay on hover
          }}
          loop={true} // Infinite loop
          speed={800} // Transition speed
        >
          {/* Render each brand */}
          {brandData.map((brand) => (
            <SwiperSlide key={brand.id}>
              {/* Brand item */}
              <div className="flex flex-col items-center justify-center group cursor-pointer">
                {/* Brand link */}
                <Link
                  href={brand.link} // External brand link
                  target="_blank"
                  className="relative w-28 h-28 flex items-center justify-center rounded-full border border-border overflow-hidden bg-bgPage hover:shadow-md transition-all duration-300"
                >
                  {/* Brand logo */}
                  <Image
                    src={brand.logo}
                    alt={brand.name} // Accessible brand name
                    width={80}
                    height={80}
                    className="object-contain opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-300"
                  />
                </Link>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ShopByBrand;
// Export brand showcase component
