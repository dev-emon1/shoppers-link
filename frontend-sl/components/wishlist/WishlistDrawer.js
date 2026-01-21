// components/wishlist/WishlistDrawer.js
"use client";

import { Heart, ShoppingBag, X, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { showToast } from "@/lib/utils/toast";
import useWishlist from "@/modules/wishlist/hooks/useWishlist";
import useCart from "@/modules/cart/hooks/useCart";
import { normalizeImage } from "@/modules/wishlist/utils/image";
import { formatPrice } from "@/modules/wishlist/utils/utils";

const DEFAULT_MEDIA_BASE =
  process.env.NEXT_PUBLIC_MEDIA_BASE || "http://localhost:8000";

const WishlistDrawer = ({ open, onClose }) => {
  const { wishlist, remove, clear } = useWishlist();
  const { add } = useCart();

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, [open]);

  const moveToCart = (item) => {
    // ensure price numeric
    const priceNum =
      Number(item.price) ||
      item.rawProduct?.price ||
      item.rawProduct?.base_price ||
      0;

    const payload = {
      vendorId:
        item.vendorId ?? item.rawProduct?.vendor?.id ?? "default-vendor",
      vendorName:
        item.vendorName ??
        item.rawProduct?.vendor?.shop_name ??
        "ShoppersLink Official",
      id: item.id,
      name: item.name,
      price: Number(priceNum) || 0,
      image:
        item.image || normalizeImage(item?.images?.[0], DEFAULT_MEDIA_BASE),
      quantity: 1,
      variantId: item.variantId ?? null,
      rawProduct: item.rawProduct ?? null,
    };

    add(payload);
    remove(item.id);
    showToast(`🛒 ${item.name} moved to cart`);
  };

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      <div
        className={`fixed top-0 right-0 h-full w-[90%] sm:w-[420px] bg-white shadow-xl z-50 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Heart size={20} className="text-main" />
            My Wishlist ({wishlist.length})
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-main transition"
          >
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {wishlist.length === 0 ? (
            <div className="text-center mt-20">
              <Heart
                size={60}
                className="text-gray-400 mx-auto mb-4 opacity-70"
              />
              <p className="text-gray-500 mb-2 font-medium">
                Your wishlist is empty 💔
              </p>
              <Link
                href="/"
                prefetch
                onClick={onClose}
                className="text-main underline hover:text-main/80 text-sm"
              >
                Continue shopping →
              </Link>
            </div>
          ) : (
            wishlist.map((item) => {
              const priceNum = Number(item.price) || 0;
              return (
                <div
                  key={item.id}
                  className="flex items-center justify-between mb-3 border rounded-lg p-3 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3 w-[70%]">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      <Image
                        src={
                          item.image ||
                          normalizeImage(
                            item?.images?.[0],
                            DEFAULT_MEDIA_BASE,
                          ) ||
                          "/images/placeholder.png"
                        }
                        alt={item.name}
                        fill
                        className="object-contain rounded-md"
                      />
                    </div>

                    <div className="truncate">
                      <h5 className="text-sm font-medium truncate">
                        {item.name}
                      </h5>
                      <p className="text-xs text-gray-500">
                        ৳{formatPrice(priceNum)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => moveToCart(item)}
                      className="bg-main text-white text-xs px-2 py-1 rounded flex items-center gap-1 hover:bg-main/90"
                    >
                      <ShoppingBag size={12} /> Move
                    </button>
                    <button
                      onClick={() => remove(item.id)}
                      className="text-xs text-red-500 hover:underline flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {wishlist.length > 0 && (
          <div className="border-t p-4 bg-white">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-gray-600">Total items:</span>
              <span className="font-semibold">{wishlist.length}</span>
            </div>
            <button
              onClick={clear}
              className="w-full border border-red-400 text-red-500 py-2 rounded-lg hover:bg-red-50 transition text-sm font-medium"
            >
              Clear Wishlist
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default WishlistDrawer;
