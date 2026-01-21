"use client";

import React, { useRef, useState, useMemo } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Card from "../ui/Card";
import ViewAllButton from "../common/ViewAllButton";
import { ProductSectionSkeleton } from "@/components/ui/skeletons";

const ProductSection = ({
  products = [],
  loading = false,
  error = false,
  title,
  subtitle,
  viewAllHref,
  showSoldCount = false,
}) => {
  // ✅ ALL HOOKS FIRST (NO CONDITION BEFORE)
  const swiperRef = useRef(null);
  const [showExpiringSoon, setShowExpiringSoon] = useState(false);

  const now = new Date();

  const sortedProducts = useMemo(() => {
    return [...products].sort((a, b) => {
      const dateA = a.featured?.ends_at
        ? new Date(a.featured.ends_at.replace(" ", "T"))
        : Infinity;
      const dateB = b.featured?.ends_at
        ? new Date(b.featured.ends_at.replace(" ", "T"))
        : Infinity;
      return dateA - dateB;
    });
  }, [products]);

  const expiringProductsCount = useMemo(() => {
    return sortedProducts.filter((p) => {
      if (!p.featured?.ends_at) return false;
      const end = new Date(p.featured.ends_at.replace(" ", "T"));
      return (end - now) / (1000 * 60 * 60 * 24) < 3;
    }).length;
  }, [sortedProducts]);

  const displayProducts = useMemo(() => {
    if (!showExpiringSoon) return sortedProducts;

    return sortedProducts.filter((p) => {
      if (!p.featured?.ends_at) return false;
      const end = new Date(p.featured.ends_at.replace(" ", "T"));
      return (end - now) / (1000 * 60 * 60 * 24) < 3;
    });
  }, [showExpiringSoon, sortedProducts]);

  // ✅ NOW SAFE TO USE CONDITIONAL RETURNS
  const shouldShowSkeleton = loading && (!products || products.length === 0);

  if (shouldShowSkeleton) {
    return <ProductSectionSkeleton title={title} />;
  }

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

  if (!products?.length) return null;

  const generateProductHref = (p) =>
    `/${[p.category?.slug, p.sub_category?.slug, p.child_category?.slug, p.slug]
      .filter(Boolean)
      .join("/")}`;

  return (
    <section className="py-14 bg-bgPage">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-textPrimary">
            {title}
            <span className="block w-24 h-1 bg-main mx-auto mt-3 rounded-full" />
          </h2>

          <p className="text-textLight mt-4 max-w-2xl mx-auto">{subtitle}</p>

          {expiringProductsCount > 0 && (
            <button
              onClick={() => setShowExpiringSoon(!showExpiringSoon)}
              className={`mt-6 px-8 py-3 rounded-full font-bold text-white transition ${
                showExpiringSoon
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

        {/* Slider */}
        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay]}
            loop={displayProducts.length >= 7}
            speed={700}
            spaceBetween={30}
            autoplay={{ delay: 4000, pauseOnMouseEnter: true }}
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
                <Card
                  data={item}
                  href={generateProductHref(item)}
                  showSoldCount={showSoldCount}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          {displayProducts.length > 5 && (
            <>
              <button
                onClick={() => swiperRef.current?.slidePrev()}
                className="hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 bg-white shadow-2xl rounded-full p-1 hover:bg-main hover:text-white transition"
              >
                <ChevronLeft size={36} />
              </button>

              <button
                onClick={() => swiperRef.current?.slideNext()}
                className="hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 bg-white shadow-2xl rounded-full p-1 hover:bg-main hover:text-white transition"
              >
                <ChevronRight size={36} />
              </button>
            </>
          )}
        </div>

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
