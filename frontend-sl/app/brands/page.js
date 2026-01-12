"use client";

import Image from "next/image";
import Link from "next/link";
import { Store } from "lucide-react";

import useShopByBrands from "@/modules/home/hooks/useShopByBrands";
import { makeImageUrl } from "@/lib/utils/image";

export default function BrandsPage() {
  const { brands, loading, error } = useShopByBrands({
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

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8 justify-items-center">
          {brands.map((brand) => {
            const hasLogo = Boolean(brand.logo);

            return (
              <Link
                key={brand.id}
                href={brand.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-28 h-28 rounded-full border border-border bg-bgPage flex items-center justify-center overflow-hidden hover:shadow-md transition"
              >
                {hasLogo ? (
                  <Image
                    src={makeImageUrl(brand.logo)}
                    alt={brand.shop_name}
                    width={80}
                    height={80}
                    className="object-contain opacity-80 group-hover:opacity-100 transition"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-textSecondary group-hover:text-main transition px-2">
                    <Store size={32} strokeWidth={1.5} />
                    <span className="mt-1 text-[11px] font-medium text-center line-clamp-2">
                      {brand.shop_name}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
