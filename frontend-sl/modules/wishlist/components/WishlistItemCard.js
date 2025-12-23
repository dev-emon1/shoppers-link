// components/wishlist/WishlistItemCard.js
"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { TbCurrencyTaka } from "react-icons/tb";
import useWishlist from "@/modules/wishlist/hooks/useWishlist";
import { normalizeImage } from "@/modules/wishlist/utils/image";

const DEFAULT_MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_BASE || "http://localhost:8000";

const WishlistItemCard = ({ item }) => {
  const { remove } = useWishlist();

  const imageSrc =
    item.image ||
    normalizeImage(item?.images?.[0], DEFAULT_MEDIA_BASE) ||
    "/images/placeholder.png";

  return (
    <div className="flex items-center justify-between bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-4">
        <Image
          src={imageSrc}
          alt={item.name}
          width={60}
          height={60}
          className="rounded-md object-cover"
        />
        <div>
          <h4 className="font-semibold text-gray-800">{item.name}</h4>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            <TbCurrencyTaka size={13} /> {item.price}
          </p>
        </div>
      </div>
      <button
        onClick={() => remove(item.id)}
        className="text-gray-400 hover:text-red-500 transition"
        aria-label="Remove from wishlist"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default WishlistItemCard;
