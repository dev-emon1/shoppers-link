// modules/category/components/CategoryHeroGrid.js
"use client";

import Image from "next/image";
import Link from "next/link";

export default function CategoryHeroGrid({ items = [], variant = "grid" }) {
  if (!items?.length)
    return (
      <div className="text-center py-12 text-muted-foreground">
        No items found.
      </div>
    );

  // ===== Pill Variant (centered large rounded buttons) =====
  if (variant === "pill") {
    return (
      <div className="w-full">
        <div className="max-w-[1100px] mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 py-8">
            {items.map((item) => (
              <Link key={item.id} href={item.href} className="block">
                <div
                  className="px-6 md:px-10 py-5 md:py-6 rounded-2xl border border-border bg-white hover:shadow-md transition-all duration-200 min-w-[180px] text-center"
                  role="button"
                >
                  <div className="text-base md:text-lg font-semibold text-textPrimary">
                    {item.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ===== Default Grid Variant (existing card grid) =====
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-8">
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="group block rounded-xl overflow-hidden border border-border bg-white hover:shadow-md transition-all"
        >
          <div className="relative w-full h-52 md:h-60 overflow-hidden">
            <Image
              src={item.image || "/images/category-placeholder.jpg"}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-3 md:p-4">
            <h3 className="text-sm md:text-base font-medium group-hover:underline text-center">
              {item.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
