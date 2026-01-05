"use client";
import React, { useMemo, useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Thumbs, Zoom, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/thumbs";
import "swiper/css/zoom";
import "swiper/css/free-mode";

const MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_BASE || "http://localhost:8000";

function buildImageUrl(value) {
  if (!value) return "";
  try {
    const str = String(value);
    if (/^https?:\/\//i.test(str)) return str;
    const base = MEDIA_BASE.endsWith("/") ? MEDIA_BASE : MEDIA_BASE + "/";
    if (str.startsWith("storage/") || str.startsWith("/storage/"))
      return new URL(str.replace(/^\/+/, ""), base).toString();
    if (/^(product_images|uploads|images)\//i.test(str))
      return new URL(`storage/${str.replace(/^\/+/, "")}`, base).toString();
    return new URL(str.replace(/^\/+/, ""), base).toString();
  } catch {
    return value;
  }
}

function normalize(entry, variantId = null) {
  if (!entry) return null;

  if (typeof entry === "object") {
    return {
      src: buildImageUrl(entry.image_path),
      color: entry.color ?? null,
      variant_id: variantId ?? entry.variant_id ?? null,
    };
  }

  if (typeof entry === "string") {
    return { src: buildImageUrl(entry), color: null, variant_id: null };
  }

  return null;
}

export default function ProductGallery({
  images = [],
  variants = [],
  selectedVariant = null,
  onSelectVariant,
  selectedColor = null,
  heroHeight = 520,
}) {
  console.log(variants);
  const [activeIdx, setActiveIdx] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const mainSwiperRef = useRef(null);

  useEffect(() => {
    if (!selectedVariant) return;

    setActiveIdx(0);

    requestAnimationFrame(() => {
      if (mainSwiperRef.current) {
        mainSwiperRef.current.slideTo(0, 0);
        mainSwiperRef.current.update();
      }
    });
  }, [selectedVariant?.id, selectedColor]);

  const [isMobile, setIsMobile] = useState(false);
  const [targetImageSrc, setTargetImageSrc] = useState(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const allImages = useMemo(() => {
    const merged = [];
    const getColorForVariant = (vid) => {
      const v = variants.find((varnt) => varnt.id === vid);
      if (!v) return null;
      try {
        const attrs = JSON.parse(v.attributes || "{}");
        return attrs.Color ?? null;
      } catch {
        return null;
      }
    };

    if (images?.length) {
      images.forEach((img) => {
        const color = img.variant_id
          ? getColorForVariant(img.variant_id)
          : null;
        const normalized = normalize(img);
        if (normalized) normalized.color = color; // Override color
        merged.push(normalized);
      });
    }

    variants?.forEach((v) => {
      (v.images || []).forEach((img) => {
        const color = getColorForVariant(v.id);
        const normalized = normalize(img, v.id);
        if (normalized) normalized.color = color; // Override color
        merged.push(normalized);
      });
    });

    const seen = new Set();
    return merged.filter((img) => {
      if (!img || seen.has(img.src)) return false;
      seen.add(img.src);
      return true;
    });
  }, [images, variants]);

  const mainDisplayImages = useMemo(() => {
    if (!selectedVariant?.attr?.Color) {
      return allImages;
    }

    const color = String(selectedVariant.attr.Color).toLowerCase();

    const colorImages = allImages.filter(
      (img) => img.color && String(img.color).toLowerCase() === color
    );

    return colorImages.length ? colorImages : allImages;
  }, [allImages, selectedVariant?.attr?.Color]);

  const thumbnailImages = allImages;

  useEffect(() => {
    if (mainDisplayImages.length > 0) {
      setActiveIdx(0);
      mainSwiperRef.current?.slideTo(0);
    }
  }, [mainDisplayImages]);

  useEffect(() => {
    if (targetImageSrc) {
      const idx = mainDisplayImages.findIndex((m) => m.src === targetImageSrc);
      if (idx !== -1) {
        setActiveIdx(idx);
        mainSwiperRef.current?.slideTo(idx);
      }
      setTargetImageSrc(null);
    }
  }, [targetImageSrc, mainDisplayImages]);

  if (!thumbnailImages.length) {
    return (
      <div className="w-full border border-border p-4 flex items-center justify-center bg-white">
        <Image
          src="/images/product-placeholder.jpg"
          alt="Placeholder"
          width={400}
          height={400}
          className="object-contain"
        />
      </div>
    );
  }

  const effectiveHeroHeight = isMobile ? 300 : heroHeight;
  const thumbnailDirection = isMobile ? "horizontal" : "vertical";
  const thumbsClassName = isMobile
    ? "h-20 w-full"
    : "w-20 max-h-[520px] flex-shrink-0";
  const flexDirectionClass = isMobile ? "flex-col" : "flex-row";

  const handleThumbnailClick = (i) => {
    const clickedImg = thumbnailImages[i];
    const clickedVariantId = clickedImg.variant_id;

    if (
      clickedVariantId &&
      String(clickedVariantId) !== String(selectedVariant?.id)
    ) {
      // Switch variant if different
      if (typeof onSelectVariant === "function") {
        onSelectVariant(clickedVariantId);
      }
      // Set target to slide to this image after switch
      setTargetImageSrc(clickedImg.src);
    } else {
      // Same variant, just slide to the image
      const idxInMain = mainDisplayImages.findIndex(
        (m) => m.src === clickedImg.src
      );
      if (idxInMain !== -1) {
        setActiveIdx(idxInMain);
        mainSwiperRef.current?.slideTo(idxInMain);
      }
    }
  };

  return (
    <div className={`flex ${flexDirectionClass} gap-4 w-full select-none`}>
      {!isMobile && (
        <Swiper
          direction={thumbnailDirection}
          modules={[Thumbs, FreeMode]}
          onSwiper={setThumbsSwiper}
          slidesPerView="auto"
          freeMode={true}
          watchSlidesProgress
          spaceBetween={isMobile ? 10 : 25}
          className={thumbsClassName}
        >
          {thumbnailImages.map((img, i) => {
            const isInCurrentVariant = mainDisplayImages.some(
              (m) => m.src === img.src
            );
            return (
              <SwiperSlide
                key={i}
                className={`cursor-pointer transition ${
                  isInCurrentVariant ? "" : "opacity-70 hover:opacity-100"
                }`}
                style={{ width: 80, height: 80 }}
                onClick={() => handleThumbnailClick(i)}
              >
                <div
                  className={`rounded-md overflow-hidden border-2 ${
                    mainDisplayImages[activeIdx]?.src === img.src
                      ? "ring-2 ring-main/50 border-main"
                      : "border-border"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={`Thumb ${i}`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                    quality={100}
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}

      {/* Main Gallery */}
      <div className="flex-1 border border-border bg-white overflow-hidden">
        <Swiper
          modules={[Thumbs, Zoom]}
          zoom={true}
          spaceBetween={10}
          onSwiper={(s) => (mainSwiperRef.current = s)}
          thumbs={{
            swiper:
              thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
          }}
          onSlideChange={(e) => setActiveIdx(e.activeIndex)}
          className="w-full h-full"
        >
          {mainDisplayImages.map((img, i) => (
            <SwiperSlide key={i}>
              <div
                className="swiper-zoom-container flex items-center justify-center bg-white"
                style={{ height: effectiveHeroHeight }}
              >
                <Image
                  src={img.src}
                  alt={`Product image ${i + 1}`}
                  fill
                  className="object-contain"
                  priority={i === 0}
                  quality={100}
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Mobile Thumbnails */}
      {isMobile && (
        <Swiper
          direction="horizontal"
          modules={[Thumbs, FreeMode]}
          onSwiper={setThumbsSwiper}
          slidesPerView="auto"
          freeMode={true}
          watchSlidesProgress
          spaceBetween={10}
          className="h-20 w-full mt-3"
        >
          {thumbnailImages.map((img, i) => {
            const isInCurrentVariant = mainDisplayImages.some(
              (m) => m.src === img.src
            );
            return (
              <SwiperSlide
                key={i}
                className={`cursor-pointer transition ${
                  isInCurrentVariant ? "" : "opacity-70 hover:opacity-100"
                }`}
                style={{ width: 80, height: 80 }}
                onClick={() => handleThumbnailClick(i)}
              >
                <div
                  className={`rounded-md overflow-hidden border-2 ${
                    mainDisplayImages[activeIdx]?.src === img.src
                      ? "ring-2 ring-main/50 border-main"
                      : "border-border"
                  }`}
                >
                  <Image
                    src={img.src}
                    alt={`Thumb ${i}`}
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                    quality={100}
                  />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      )}
    </div>
  );
}
