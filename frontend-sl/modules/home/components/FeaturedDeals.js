"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Heart, ShoppingCart } from "lucide-react";
import footwear from "../../public/images/products/5.webp";
import others from "../../public/images/products/7.webp";
import smartwatch from "../../public/images/products/8.webp";

const FeaturedDeal = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 2,
    minutes: 15,
    seconds: 38,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        if (seconds > 0) seconds--;
        else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const featured = [
    {
      name: "Nike Shoes",
      oldPrice: 39.99,
      newPrice: 29.99,
      image: footwear,
    },
    {
      name: "Smart Watch New Series",
      oldPrice: 29.99,
      newPrice: 19.99,
      image: smartwatch,
    },
    {
      name: "Camera HD + Lens",
      oldPrice: 29.99,
      newPrice: 19.99,
      image: others,
    },
  ];

  return (
    <section className="py-16 bg-[#faf7fb]">
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-textPrimary">
            Featured Products
          </h2>
          <p className="text-textLight text-base mt-3 max-w-lg mx-auto leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt.
          </p>
        </div>

        {/* Grid Layout */}
        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {/* LEFT MAIN CARD */}
          <div className="bg-white border border-border rounded-2xl shadow-md flex flex-col justify-between text-center p-8 hover:shadow-lg transition-all duration-300 h-full relative overflow-hidden group">
            <div className="flex flex-col justify-center flex-grow">
              <h3 className="font-semibold text-lg text-textPrimary mb-2">
                {featured[0].name}
              </h3>
              <p className="text-base mb-5">
                <span className="line-through text-textLight mr-2 text-sm">
                  ${featured[0].oldPrice}
                </span>
                <span className="text-red font-bold text-lg">
                  ${featured[0].newPrice}
                </span>
              </p>

              {/* Image + Overlay */}
              <div className="relative w-full h-[300px] flex justify-center items-center overflow-hidden rounded-xl">
                <Image
                  src={featured[0].image}
                  alt={featured[0].name}
                  width={280}
                  height={280}
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-4">
                  <button className="flex items-center gap-2 bg-main text-white text-sm font-semibold px-4 py-2 rounded-md hover:bg-secondary transition-all">
                    <ShoppingCart size={16} /> Add to Cart
                  </button>
                  <button className="flex items-center gap-2 border border-white text-white px-4 py-2 text-sm rounded-md hover:bg-white hover:text-main transition-all">
                    <Heart size={16} /> Wishlist
                  </button>
                </div>
              </div>
            </div>

            {/* Timer */}
            <div className="flex gap-4 justify-center mt-8">
              {["Hours", "Minutes", "Seconds"].map((label, i) => (
                <div
                  key={i}
                  className="w-24 h-24 flex flex-col items-center justify-center bg-white border border-border rounded-xl shadow-sm"
                >
                  <p className="text-main font-bold text-xl">
                    {i === 0
                      ? timeLeft.hours
                      : i === 1
                      ? timeLeft.minutes
                      : timeLeft.seconds}
                  </p>
                  <span className="text-[11px] text-textSecondary">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT TWO CARDS */}
          <div className="flex flex-col gap-8 md:col-span-2 justify-between">
            {featured.slice(1).map((item, index) => (
              <div
                key={index}
                className="group flex items-center gap-6 bg-white border border-border rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex-1 relative overflow-hidden"
              >
                {/* Image with overlay */}
                <div className="relative w-[38%] h-[200px] flex-shrink-0 rounded-xl overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-3">
                    <button className="flex items-center gap-2 bg-main text-white text-xs font-semibold px-3 py-1.5 rounded-md hover:bg-secondary transition-all">
                      <ShoppingCart size={14} /> Add to Cart
                    </button>
                    <button className="flex items-center gap-2 border border-white text-white px-3 py-1.5 text-xs rounded-md hover:bg-white hover:text-main transition-all">
                      <Heart size={14} /> Wishlist
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col justify-center flex-grow text-left">
                  <span className="bg-red text-white text-xs px-3 py-1 rounded-md font-semibold w-fit">
                    Limited Offer
                  </span>
                  <h4 className="font-semibold text-lg text-textPrimary mt-3">
                    {item.name}
                  </h4>
                  <p className="text-base mt-2">
                    <span className="line-through text-textLight mr-2 text-sm">
                      ${item.oldPrice}
                    </span>
                    <span className="text-red font-bold text-lg">
                      ${item.newPrice}
                    </span>
                  </p>

                  {/* Timer */}
                  <div className="flex gap-4 mt-5">
                    {["Hrs", "Min", "Sec"].map((label, i) => (
                      <div
                        key={i}
                        className="w-20 h-20 flex flex-col items-center justify-center bg-white border border-border rounded-xl"
                      >
                        <p className="text-main font-bold text-lg">
                          {i === 0
                            ? timeLeft.hours
                            : i === 1
                            ? timeLeft.minutes
                            : timeLeft.seconds}
                        </p>
                        <span className="text-[11px] text-textSecondary">
                          {label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedDeal;
