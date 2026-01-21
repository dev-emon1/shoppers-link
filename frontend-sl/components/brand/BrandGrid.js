"use client";

import Link from "next/link";
import Image from "next/image";
import { makeImageUrl } from "@/lib/utils/image";

export default function BrandGrid({ brands = [] }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6">
      {brands.map((brand) => (
        <Link
          key={brand.id}
          href={`/brand/${brand.slug}`}
          prefetch
          className="group border rounded-lg p-4 flex flex-col items-center hover:shadow-md transition"
        >
          <Image
            src={makeImageUrl(brand.logo)}
            alt={brand.name}
            width={120}
            height={120}
            className="object-contain h-16"
          />
          <span className="mt-2 text-sm text-center">{brand.name}</span>
        </Link>
      ))}
    </div>
  );
}
