// Marks this component as a Client Component (runs in the browser)
"use client";

// useMemo is used to memoize the Swiper configuration for performance
import { useMemo } from "react";

// Framer Motion is used for smooth entrance animations
import { motion } from "framer-motion";

// Next.js optimized Image component for better performance
import Image from "next/image";

// Core Swiper components
import { Swiper, SwiperSlide } from "swiper/react";

// Swiper modules for autoplay and pagination
import { Autoplay, Pagination } from "swiper/modules";

// Custom hook responsible for fetching banner data from the API
import useBanners from "../hooks/useBanners";

// Utility function to convert backend image path into full URL
import { makeImageUrl } from "@/lib/utils/image";

export default function Banner() {
  // Destructure banner data and request states from custom hook
  const { banners, loading, error } = useBanners();

  /* ------------------------------------------------------------
     Swiper configuration
     NOTE: Hooks must always be called unconditionally
  ------------------------------------------------------------ */
  const swiperConfig = useMemo(
    () => ({
      // Enable required Swiper modules
      modules: [Autoplay, Pagination],

      // Autoplay configuration
      autoplay: {
        delay: 5000, // Slide changes every 5 seconds
        disableOnInteraction: false, // Continue autoplay after user interaction
      },

      // Enable clickable pagination dots
      pagination: { clickable: true },

      // Enable loop only when more than one banner exists
      loop: banners?.length > 1,

      // Maintain full height for Swiper container
      className: "h-full",
    }),
    // Recalculate config only when banner count changes
    [banners?.length]
  );

  /* ------------------------------------------------------------
     Guard clauses (after hooks)
     Prevent rendering in invalid states
  ------------------------------------------------------------ */

  // Do not render anything while data is loading
  if (loading) return null;

  // Do not render if error occurs or banners are invalid/empty
  if (error || !Array.isArray(banners) || banners.length === 0) return null;

  return (
    // Banner section wrapper
    <section className="relative w-full h-[80vh] overflow-hidden lg:mt-[26px]">
      {/* Swiper slider container */}
      <Swiper {...swiperConfig}>
        {/* Render each banner as a slide */}
        {banners.map((banner, index) => (
          <SwiperSlide key={banner.id}>
            {/* ================= Background Layer ================= */}
            <div className="absolute inset-0">
              {/* Optimized background image */}
              {console.log(makeImageUrl(banner.image))}
              <Image
                src={makeImageUrl(banner.image)} // Full image URL
                alt={banner.title || "Promotional banner"} // Accessible alt text
                fill // Fills the parent container
                priority={index === 0} // First slide loads with priority
                sizes="100vw" // Responsive image sizing
                className="object-cover" // Maintain aspect ratio with cover
              />

              {/* Gradient overlay for better text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
            </div>

            {/* ================= Content Layer ================= */}
            <div className="relative z-10 flex flex-col justify-center h-full px-6 md:px-16 lg:px-24">
              {/* Animated banner title */}
              <motion.h1
                initial={{ opacity: 0, y: 30 }} // Initial animation state
                whileInView={{ opacity: 1, y: 0 }} // Final animation state
                transition={{ duration: 0.8 }} // Animation duration
                className="text-4xl md:text-6xl font-semibold text-white max-w-[700px] leading-tight"
              >
                {banner.title}
              </motion.h1>

              {/* Render description only if it exists */}
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

              {/* Render CTA button only if link and text are available */}
              {banner.cta_link && banner.cta_text && (
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8"
                >
                  <a
                    href={banner.cta_link} // CTA destination URL
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
