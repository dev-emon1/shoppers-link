"use client";
// Marks this component as a Client Component (uses browser-side rendering)

import React from "react";
// React core import

import Image from "next/image";
// Next.js optimized Image component for performance and responsiveness

import promoImg from "@/public/images/banners/promo1.webp";
// Static promotional banner image

const PromoBanner = () => {
  return (
    // Main promotional banner section
    <section className="relative w-full py-8 md:py-16">
      <div className="container relative overflow-hidden rounded-2xl">
        {/* Banner image wrapper */}
        <div className="relative w-full h-[260px] sm:h-[320px] md:h-[440px] lg:h-[520px] rounded-2xl overflow-hidden">
          {/* Background promotional image */}
          <Image
            src={promoImg}
            alt="Luxury Tech Promotion" // Accessible alt text
            fill // Fill parent container
            priority // Load image with high priority
            className="object-cover object-center scale-[1.02] hover:scale-[1.06] transition-transform duration-[2500ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
          />

          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 md:via-black/40 to-transparent" />

          {/* Content container */}
          <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8 md:px-14 lg:px-24 text-white">
            {/* Eyebrow / small heading */}
            <h3 className="uppercase text-[10px] sm:text-xs md:text-sm tracking-[3px] sm:tracking-[4px] md:tracking-[6px] text-gray-300 mb-2 sm:mb-3">
              Exclusive Deal Of The Month
            </h3>

            {/* Main promotional headline */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-snug md:leading-tight max-w-xs sm:max-w-md md:max-w-2xl mb-2 sm:mb-4">
              <span className="text-main">Powered by Local Hands,</span>{" "}
              Inspired by Bangladesh
            </h1>

            {/* Promotional description */}
            <p className="text-[11px] sm:text-sm md:text-base text-gray-200 max-w-[90%] sm:max-w-lg md:max-w-xl mb-4 sm:mb-6">
              From tea gardens to your cup — experience the finest blends made
              by Bangladesh’s rising entrepreneurs. Enjoy{" "}
              <span className="text-main font-semibold">Up to 70% OFF</span> on
              selected local brands this season.
            </p>

            {/* Call-to-action button */}
            <button className="w-fit bg-main hover:bg-mainHover text-[11px] sm:text-sm md:text-base px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-md font-semibold transition-all duration-300 shadow-lg hover:shadow-xl">
              Support Local Brands →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
// Export promotional banner component
