"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import useWishlistSession from "@/modules/wishlist/hooks/useWishlist";
import useCartSession from "@/modules/cart/hooks/useCart";
import toast from "react-hot-toast";
import { IMAGE_URL } from "@/core/api/axiosClient";
import useCart from "@/modules/cart/hooks/useCart";
import useWishlist from "@/modules/wishlist/hooks/useWishlist";

export default function WishlistPage() {
  const { wishlist, remove, clear } = useWishlist();
  const { add } = useCart();
  const handleMoveToCart = (product) => {
    // 1. Ensure price is a number
    const priceNum = Number(product.price) || 0;

    // 2. Construct the payload based on your Redux hook requirements
    const payload = {
      vendorId: product.vendor.id ?? "default-vendor",
      vendorName: product.vendorName ?? "ShoppersLink Official",
      id: product.id,
      name: product.name,
      price: priceNum,
      // Use the same image logic you used in the <img> tag below
      image: product?.primary_image || "placeholder.png",
      quantity: 1,
      variantId: product?.variants?.[0]?.id || null,
    };
    // console.log(payload);

    // 3. Execute actions
    add(payload);
    remove(product.id); // Uncommented so it actually "moves" the item
    toast.success(`🛒 ${product.name} moved to cart`);
  };
  console.log(wishlist);
  const buildHref = (p) =>
    `/${[p.category?.slug, p.sub_category?.slug, p.child_category?.slug, p.slug]
      .filter(Boolean)
      .join("/")}`;
  return (
    <div className="container py-10 space-y-8">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">My Wishlist</h1>
        <p className="text-gray-600">Items you saved. Continue shopping ❤️</p>
      </div>

      {/* EMPTY STATE */}
      {(!wishlist || wishlist.length === 0) && (
        <div className="bg-white rounded-2xl border shadow-sm p-10 text-center max-w-lg mx-auto">
          <Heart size={50} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">
            Browse items and add to your wishlist.
          </p>
          <Link
            href="/"
            prefetch
            className="px-6 py-3 bg-main text-white rounded-lg hover:bg-mainHover transition"
          >
            Continue Shopping
          </Link>
        </div>
      )}

      {/* WISHLIST GRID */}
      {wishlist && wishlist.length > 0 && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product.id}
              className="bg-white border rounded-2xl shadow-sm p-4 group hover:shadow-md transition"
            >
              {/* Image */}
              <Link
                href={buildHref(product)}
                prefetch
                className="block overflow-hidden"
              >
                <Image
                  src={`${IMAGE_URL}/storage/${product?.primary_image || "placeholder.png"}`}
                  alt={product.name}
                  width={300}
                  height={250}
                  className="rounded-xl object-contain w-full h-[220px]"
                />
              </Link>

              {/* Info */}
              <div className="mt-4 space-y-1">
                <Link href={`/product/${product.slug}`}>
                  <h3 className="font-semibold text-gray-800 group-hover:text-main">
                    {product.name}
                  </h3>
                </Link>

                <p className="text-gray-600 text-sm">{product.brand}</p>

                <p className="text-lg font-semibold text-main">
                  ৳ {product.price}
                </p>
              </div>

              {/* Actions */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={() => handleMoveToCart(product)}
                  className="flex items-center gap-2 px-3 py-2 bg-main text-white rounded-lg hover:bg-mainHover transition text-sm"
                >
                  <ShoppingBag size={16} /> Add to Cart
                </button>

                <button
                  onClick={() => remove(product.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-red-500 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
