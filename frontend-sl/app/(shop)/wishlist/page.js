"use client";
import { useWishlistSession } from "@/modules/wishlist/hooks/useWishlist";
import WishlistGrid from "@/modules/wishlist/components/WishlistGrid";
import { Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const WishlistPage = () => {
  const { wishlist, clearWishlist } = useWishlistSession();
  // console.log(wishlist);

  return (
    <section className="container py-12 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2 text-textPrimary">
          <Heart className="text-main" /> Your Wishlist
        </h1>

        {wishlist.length > 0 && (
          <button
            onClick={clearWishlist}
            className="text-sm text-red-500 border border-red-400 px-3 py-1 rounded-md hover:bg-red-50 transition"
          >
            Clear All
          </button>
        )}
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <Image
            src="/images/empty-wishlist.svg"
            alt="Empty wishlist"
            width={200}
            height={200}
            className="opacity-80 mb-4"
          />
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Your wishlist is empty 💔
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Browse products and add them to your wishlist to view them later.
          </p>
          <Link
            href="/"
            prefetch
            className="bg-main text-white px-5 py-2 rounded-lg hover:bg-main/90 transition"
          >
            Continue Shopping →
          </Link>
        </div>
      ) : (
        <WishlistGrid items={wishlist} />
      )}
    </section>
  );
};

export default WishlistPage;
