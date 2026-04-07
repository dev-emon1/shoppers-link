"use client";

import Image from "next/image";
import Link from "next/link";

import useCategories from "@/modules/category/hooks/useCategories";
import { makeImageUrl } from "@/lib/utils/image";

export default function CategoryClient() {
  const { categories, loading } = useCategories();

  // ⛔ Only block UI if nothing exists
  if (loading && (!categories || categories.length === 0)) {
    return (
      <div className="py-10 text-center text-gray-500">
        Loading categories...
      </div>
    );
  }

  if (!categories?.length) return null;

  return (
    <section className="py-10 bg-bgPage">
      <div className="container">
<<<<<<< HEAD
=======
        {/* Title */}
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
        <div className="relative text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-textPrimary inline-block relative after:content-[''] after:absolute after:left-1/2 after:-bottom-2 after:-translate-x-1/2 after:w-20 after:h-[2px] after:bg-main after:rounded-full">
            Shop by Category
          </h2>
        </div>

<<<<<<< HEAD
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-10 gap-2 sm:gap-3 md:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${cat.slug}`}
              prefetch
              className="group relative border border-border bg-bgSurface rounded-md p-3 flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:border-main hover:shadow-[0_4px_14px_rgba(224,125,66,0.2)]"
            >
              <div className="relative flex justify-center items-center aspect-square w-full overflow-hidden rounded-md">
                <Image
                  src={makeImageUrl(cat.image)}
                  alt={cat.name}
                  width={160}
                  height={160}
                  sizes="(max-width:768px) 33vw, 160px"
                  placeholder="blur"
                  blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/OhPPQAJJAPX8L9BHgAAAABJRU5ErkJggg=="
                  className="object-contain w-[80%] transition-transform duration-300 group-hover:scale-110 rounded-lg bg-gray-100"
                />

                <div className="absolute inset-0 bg-main/0 group-hover:bg-main/5 transition-colors duration-300" />
              </div>

              <span
                className="mt-2 font-medium text-[10px] sm:text-xs text-textPrimary group-hover:text-main transition-colors duration-300 w-full text-center truncate"
                title={cat.name}
              >
                {cat.name}
              </span>

              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-main transition-all duration-300 group-hover:w-2/3 rounded-full" />
            </Link>
=======
        {/* ✅ FLEX GRID (CENTER FIXED) */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-6 md:gap-10">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="
                w-[calc(100%/3-8px)]
                sm:w-[calc(100%/4-12px)]
                md:w-[calc(100%/5-16px)]
                lg:w-[calc(100%/6-16px)]
                xl:w-[calc(100%/8-16px)]
              "
            >
              <Link
                href={`/${cat.slug}`}
                prefetch
                className=" group relative border border-border bg-bgSurface rounded-md p-3 flex flex-col items-center justify-center transition-all duration-300 hover:-translate-y-1 hover:border-main hover:shadow-[0_4px_14px_rgba(224,125,66,0.2)]"
              >
                {/* Image */}
                <div className="relative flex justify-center items-center aspect-square w-full overflow-hidden rounded-md">
                  <Image
                    src={makeImageUrl(cat.image)}
                    alt={cat.name}
                    width={160}
                    height={160}
                    sizes="(max-width:768px) 33vw, 160px"
                    placeholder="blur"
                    blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mN8/OhPPQAJJAPX8L9BHgAAAABJRU5ErkJggg=="
                    className="object-contain w-[80%] transition-transform duration-300 group-hover:scale-110 rounded-lg bg-gray-100"
                  />

                  <div className="absolute inset-0 bg-main/0 group-hover:bg-main/5 transition-colors duration-300" />
                </div>

                {/* Name */}
                <span
                  className="mt-2 font-medium text-[10px] sm:text-xs text-textPrimary group-hover:text-main transition-colors duration-300 w-full text-center truncate"
                  title={cat.name}
                >
                  {cat.name}
                </span>

                {/* Bottom line */}
                <span className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0 h-[1px] bg-main transition-all duration-300 group-hover:w-2/3 rounded-full" />
              </Link>
            </div>
>>>>>>> 5f23822ac1c2cace21dbeea32a72bacb037ca79b
          ))}
        </div>
      </div>
    </section>
  );
}
