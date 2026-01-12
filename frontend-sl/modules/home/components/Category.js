"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";

import useCategories from "@/modules/category/hooks/useCategories";
import { makeImageUrl } from "@/lib/utils/image";

const CategoryGrid = () => {
  const { categories, loading } = useCategories();

  /* ------------------------------------------------------------
     Loading state (UNCHANGED)
  ------------------------------------------------------------ */
  if (loading)
    return (
      <div className="py-10 text-center text-gray-500">
        Loading categories...
      </div>
    );

  return (
    <section className="py-10 bg-bgPage">
      <div className="container">
        {/* Section heading */}
        <div className="relative text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-textPrimary inline-block relative after:content-[''] after:absolute after:left-1/2 after:-bottom-2 after:-translate-x-1/2 after:w-20 after:h-[2px] after:bg-main after:rounded-full">
            Shop by Category
          </h2>
        </div>

        {/* Responsive category grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10 gap-2 sm:gap-3 md:gap-4">
          {categories.map((cat) => (
            <Link
              href={`/${cat.slug}`}
              key={cat.id}
              className="group relative border border-border bg-bgSurface rounded-md p-3 flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:border-main hover:shadow-[0_4px_14px_rgba(224,125,66,0.2)]"
            >
              {/* Image wrapper */}
              <div className="relative flex justify-center items-center aspect-square w-full overflow-hidden rounded-md">
                <Image
                  src={makeImageUrl(cat?.image)}
                  alt={cat.name}
                  width={200}
                  height={200}
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/OhPPQAJJAPX8L9BHgAAAABJRU5ErkJggg=="
                  className="object-contain w-[80%] transition-transform duration-300 group-hover:scale-110 rounded-lg bg-gray-100"
                  unoptimized
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-main/0 group-hover:bg-main/5 transition-colors duration-300" />
              </div>

              {/* Category name */}
              <span
                className="mt-2 font-medium text-[10px] sm:text-xs text-textPrimary group-hover:text-main transition-colors duration-300 w-full text-center truncate"
                title={cat.name}
              >
                {cat.name}
              </span>

              {/* Bottom underline */}
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-main transition-all duration-300 group-hover:w-2/3 rounded-full"></span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;
