"use client";
// Marks this component as a Client Component (required for hooks & Swiper)

import React, { useRef, useState } from "react";
// useRef: control Swiper navigation
// useState: UI state (expiring filter toggle)

import { Swiper, SwiperSlide } from "swiper/react";
// Swiper core components

import { Navigation, Autoplay } from "swiper/modules";
// Swiper modules for navigation arrows and autoplay

import { ChevronLeft, ChevronRight } from "lucide-react";
// Icons for custom navigation arrows

import Card from "../ui/Card";
// Product card component

import ViewAllButton from "../common/ViewAllButton";
// Reusable "View All" button component

const ProductSection = ({ useProductsHook, title, subtitle, viewAllHref }) => {
  // Reference to Swiper instance (for manual navigation)
  const swiperRef = useRef(null);

  // Fetch products using injected hook
  const { products, loading, error } = useProductsHook();

  // Toggle state for "Expiring Soon" filter
  const [showExpiringSoon, setShowExpiringSoon] = useState(false);

  /* ------------------------------------------------------------
     Loading state
  ------------------------------------------------------------ */
  if (loading) {
    return (
      <section className="py-14 bg-bgPage">
        <div className="container">
          <h2 className="text-center text-xl font-semibold mb-6">{title}</h2>

          {/* Skeleton loaders */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="h-80 rounded-xl bg-main/10 animate-pulse"
              >
                <div className="w-full h-3/4 bg-gray-main/10 px-4 pt-4" >
                  <div className="w-full h-full bg-main/10 rounded" />
                </div>{/* Image placeholder */}
                <div className="p-4">
                  <div className="h-4 bg-main/10 rounded mb-2" />{/* Title placeholder */}
                  <div className="h-4 bg-main/10 rounded w-1/2 mx-auto" />{/* Price placeholder */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  /* ------------------------------------------------------------
     Error state
  ------------------------------------------------------------ */
  if (error) {
    return (
      <section className="py-14 bg-bgPage">
        <div className="container text-center">
          <p className="text-red-500">
            Failed to load {title}. Please try again.
          </p>
        </div>
      </section>
    );
  }

  // Do not render section if no products exist
  if (!products?.length) return null;

  /* ------------------------------------------------------------
     Generate SEO-friendly product URL
  ------------------------------------------------------------ */
  const generateProductHref = (p) =>
    `/${[p.category?.slug, p.sub_category?.slug, p.child_category?.slug, p.slug]
      .filter(Boolean)
      .join("/")}`;

  /* ------------------------------------------------------------
     Sort products by "featured expiry date"
     Products expiring sooner appear first
  ------------------------------------------------------------ */
  const sortedProducts = [...products].sort((a, b) => {
    const dateA = a.featured?.ends_at
      ? new Date(a.featured.ends_at.replace(" ", "T"))
      : Infinity;
    const dateB = b.featured?.ends_at
      ? new Date(b.featured.ends_at.replace(" ", "T"))
      : Infinity;
    return dateA - dateB;
  });

  /* ------------------------------------------------------------
     Count products expiring within next 3 days
  ------------------------------------------------------------ */
  const now = new Date();
  const expiringProductsCount = sortedProducts.filter((p) => {
    if (!p.featured?.ends_at) return false;
    const end = new Date(p.featured.ends_at.replace(" ", "T"));
    return (end - now) / (1000 * 60 * 60 * 24) < 3;
  }).length;

  /* ------------------------------------------------------------
     Decide which products to display
  ------------------------------------------------------------ */
  const displayProducts = showExpiringSoon
    ? sortedProducts.filter((p) => {
      if (!p.featured?.ends_at) return false;
      const end = new Date(p.featured.ends_at.replace(" ", "T"));
      return (end - now) / (1000 * 60 * 60 * 24) < 3;
    })
    : sortedProducts;

  return (
    <section className="py-14 bg-bgPage">
      <div className="container">
        {/* ================= Section Header ================= */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-textPrimary relative inline-block">
            {title}
            <span className="block w-24 h-1 bg-main mx-auto mt-3 rounded-full" />
          </h2>

          <p className="text-textLight text-base mt-4 max-w-2xl mx-auto">
            {subtitle || "Explore our highlighted selections"}
          </p>

          {/* Expiring Soon toggle button */}
          {expiringProductsCount > 0 && (
            <button
              onClick={() => setShowExpiringSoon(!showExpiringSoon)}
              className={`mt-6 px-8 py-3 rounded-full font-bold text-white transition shadow-lg ${showExpiringSoon
                ? "bg-secondary hover:bg-secondaryHover"
                : "bg-main hover:bg-mainHover"
                }`}
            >
              {showExpiringSoon
                ? "Show All Products"
                : `Expiring Soon (${expiringProductsCount})`}
            </button>
          )}
        </div>

        {/* ================= Product Slider ================= */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            loop={displayProducts.length >= 7} // Enable loop only if enough items
            speed={700}
            spaceBetween={30}
            autoplay={{ delay: 4000, pauseOnMouseEnter: true }}
            className="pb-8"
            onBeforeInit={(swiper) => (swiperRef.current = swiper)}
            breakpoints={{
              480: { slidesPerView: 2, spaceBetween: 20 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
              1280: { slidesPerView: 5 },
            }}
          >
            {displayProducts.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="transition-transform duration-500 hover:-translate-y-1">
                  <Card data={item} href={generateProductHref(item)} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom navigation arrows */}
          {displayProducts.length > 5 && (
            <>
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-white shadow-2xl rounded-full p-1 hover:bg-main hover:text-white transition"
                aria-label="Previous"
              >
                <ChevronLeft size={36} />
              </button>

              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-white shadow-2xl rounded-full p-1 hover:bg-main hover:text-white transition"
                aria-label="Next"
              >
                <ChevronRight size={36} />
              </button>
            </>
          )}
        </div>

        {/* ================= View All ================= */}
        {viewAllHref && displayProducts.length >= 5 && (
          <div className="text-center mt-10">
            <ViewAllButton href={viewAllHref} />
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
// Reusable section component for all product-based sliders
