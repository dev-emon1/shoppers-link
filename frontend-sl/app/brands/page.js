"use client";

import Image from "next/image";
import Link from "next/link";
import { Store } from "lucide-react";

import useShopByBrands from "@/modules/home/hooks/useShopByBrands";
import { makeImageUrl } from "@/lib/utils/image";

export default function BrandsPage() {
  const { brands, loading, loadingMore, error, hasMore, loadMore } =
    useShopByBrands({
      mode: "listing",
    });

  if (loading) {
    return (
      <div className="py-20 text-center text-textSecondary">
        Loading brands...
      </div>
    );
  }

  if (error || !brands.length) return null;

  return (
    <section className="py-16 bg-bgPage">
      <div className="container">
        <h1 className="text-3xl font-bold text-center mb-12">All Brands</h1>

        {/* GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 justify-items-center">
          {brands.map((brand, index) => {
            if (!brand || !brand.id) return null;

            const hasLogo = Boolean(brand.logo);

            const content = hasLogo ? (
              <Image
                src={makeImageUrl(brand.logo)}
                alt={brand.shop_name || "brand"}
                width={80}
                height={80}
                className="object-contain opacity-80 group-hover:opacity-100 transition"
              />
            ) : (
              <div className="flex flex-col items-center justify-center text-textSecondary group-hover:text-main transition px-2">
                <Store size={32} />
                <span className="mt-1 text-[11px] font-medium text-center line-clamp-2">
                  {brand.shop_name || "Brand"}
                </span>
              </div>
            );

            const commonClass =
              "group relative w-28 h-28 rounded-full border border-border bg-bgPage flex items-center justify-center overflow-hidden transition";

            return brand.link ? (
              <Link
                key={`${brand.id}-${index}`} // ✅ ultra safe
                href={brand.link}
                target="_blank"
                rel="noopener noreferrer"
                className={commonClass + " hover:shadow-md"}
              >
                {content}
              </Link>
            ) : (
              <div
                key={`${brand.id}-${index}`} // ✅ ultra safe
                className={commonClass + " opacity-70"}
              >
                {content}
              </div>
            );
          })}
        </div>

        {/* 🔥 LOAD MORE BUTTON */}
        {/* LOAD MORE */}
        {hasMore && typeof loadMore === "function" && (
          <div className="flex justify-center mt-10 mb-4">
            <button
              onClick={loadMore}
              disabled={loadingMore}
              className="bg-white text-main border border-main px-4 py-1 rounded-sm hover:bg-main/5 disabled:opacity-60 transition-all text-sm"
            >
              {loadingMore ? "Loading..." : "Load more"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
