"use client";
import React from "react";
import Image from "next/image";
import promoImg2 from "../../public/images/banners/promo2.webp";

const PromoBannerSplit = () => {
  return (
    <section className="py-10 md:py-16 bg-bgPage">
      <div className="container">
        <div className="flex flex-col-reverse lg:flex-row items-center bg-bgSurface rounded-2xl overflow-hidden shadow-md">
          {/* 🧾 Text Content */}
          <div className="w-full lg:w-1/2 px-6 sm:px-10 lg:px-14 py-8 sm:py-10 lg:py-14 flex flex-col justify-center text-center lg:text-left">
            <h3 className="uppercase text-[11px] sm:text-xs md:text-sm tracking-[3px] text-main font-semibold mb-2 sm:mb-3">
              Summer Collection 2025
            </h3>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-textPrimary leading-snug sm:leading-tight mb-3 sm:mb-4">
              Step Into <span className="text-main">Comfort & Style</span>
            </h2>

            <p className="text-[12px] sm:text-sm md:text-base text-textSecondary max-w-md mx-auto lg:mx-0 mb-5 sm:mb-6">
              Explore the latest trends in footwear and apparel crafted for
              ultimate comfort and durability. Get up to{" "}
              <span className="text-main font-semibold">50% OFF</span> on
              selected items. Limited-time offer!
            </p>

            <button className="w-fit mx-auto lg:mx-0 bg-main hover:bg-mainHover text-[11px] sm:text-sm md:text-base px-5 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-md font-semibold text-white transition-all duration-300 shadow-md hover:shadow-xl">
              Shop the Collection →
            </button>
          </div>

          {/* 🖼️ Banner Image */}
          <div className="w-full lg:w-1/2 h-[240px] sm:h-[300px] md:h-[380px] lg:h-[460px] relative overflow-hidden">
            <Image
              src={promoImg2}
              alt="Fashion and Lifestyle Banner"
              fill
              className="object-cover object-center transform scale-[1.03] hover:scale-[1.08] transition-transform duration-[2000ms] ease-[cubic-bezier(0.25,0.1,0.25,1)]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/30 via-black/10 to-transparent lg:hidden rounded-t-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoBannerSplit;
