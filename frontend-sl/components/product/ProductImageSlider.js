"use client";

import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import { makeImageUrl } from "@/lib/utils/image";

import "swiper/css";

const ProductImageSlider = ({ images = [], isHovered = false }) => {
  const swiperRef = useRef(null);

  // single image → no slider
  if (!images || images.length <= 1) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={makeImageUrl(images?.[0]?.image_path)}
          alt="Product"
          fill
          className="object-contain p-4"
        />
      </div>
    );
  }

  useEffect(() => {
    if (!swiperRef.current) return;

    if (isHovered) {
      swiperRef.current.autoplay.start();
    } else {
      swiperRef.current.autoplay.stop();
      swiperRef.current.slideTo(0);
    }
  }, [isHovered]);

  return (
    <Swiper
      modules={[Autoplay]}
      onSwiper={(swiper) => {
        swiperRef.current = swiper;
        swiper.autoplay.stop(); // IMPORTANT
      }}
      slidesPerView={1}
      loop
      autoplay={{
        delay: 1600,
        disableOnInteraction: true,
      }}
      className="w-full h-full"
    >
      {images.map((img, i) => (
        <SwiperSlide key={i}>
          <div className="relative w-full h-full">
            <Image
              src={makeImageUrl(img.image_path)}
              alt="Product"
              fill
              className="object-contain p-4"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default ProductImageSlider;
