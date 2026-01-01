"use client";

import { X, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import useCart from "@/modules/cart/hooks/useCart"; // existing hook

const toNumber = (v) => {
  if (v === null || v === undefined) return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const formatPrice = (v) => {
  const n = toNumber(v);
  return n.toFixed(2);
};

const getImageSrc = (item) => {
  const first = item?.images?.[0] ?? item?.image ?? "";
  if (!first) return "/images/placeholder.png";
  if (typeof first === "string") {
    if (/^https?:\/\//i.test(first)) return first;
    if (first.startsWith("http:/") || first.startsWith("http:")) {
      return first.replace("http:/", "http://");
    }
    if (first.startsWith("/")) return first;
    return `${process.env.NEXT_PUBLIC_MEDIA_BASE ?? "http://localhost:8000"
      }/storage/${first.replace(/^\/+/, "")}`;
  }
  if (typeof first === "object") {
    if (first?.src) return first.src;
    if (first?.image_path) {
      return `${process.env.NEXT_PUBLIC_MEDIA_BASE ?? "http://localhost:8000"
        }/storage/${String(first.image_path).replace(/^\/+/, "")}`;
    }
  }
  return "/images/placeholder.png";
};

const MiniCartDrawer = ({ open, onClose }) => {
  const {
    cart = {},
    totalItems = 0,
    totalPrice = 0,
    updateQty,
    remove,
  } = useCart();

  // mounted flag to avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const vendorKeys = Array.isArray(Object.keys(cart)) ? Object.keys(cart) : [];

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const subtotalNumber = toNumber(totalPrice);

  // Ensure initial render matches SSR: until mounted, treat cart as empty and totalItems as 0
  const vendorKeysForRender = mounted ? vendorKeys : [];
  const totalItemsForRender = mounted ? toNumber(totalItems) : 0;
  const subtotalForRender = mounted ? subtotalNumber : 0;
  // console.log(cart);


  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${open ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-[90%] sm:w-[420px] bg-white shadow-xl z-50 flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <ShoppingBag size={20} className="text-main" />
            My Cart ({totalItemsForRender})
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-main transition"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4">
          {vendorKeysForRender.length === 0 ? (
            <div className="text-center mt-20">
              <ShoppingBag
                size={60}
                className="text-gray-400 mx-auto mb-4 opacity-70"
              />
              <p className="text-gray-500 mb-2 font-medium">
                Your cart is empty.
              </p>
              <Link
                href="/"
                onClick={onClose}
                className="text-main underline hover:text-main/80 text-sm"
              >
                Continue shopping →
              </Link>
            </div>
          ) : (
            vendorKeysForRender.map((vendorId) => {
              const vendor = cart[vendorId];
              if (!vendor || !Array.isArray(vendor.items)) return null;

              return (
                <div key={vendorId} className="mb-6 border-b pb-4">
                  <h4 className="font-semibold mb-3">
                    🏬 {vendor.vendorName ?? "Vendor"}
                  </h4>

                  {vendor.items.map((item) => {
                    const currentQty = Number(item.quantity) || 1;
                    const stock = Number(item.stock) || 10;

                    const imageSrc = getImageSrc(item);

                    const handleDecrease = () => {
                      if (currentQty <= 1) return;
                      updateQty?.({
                        vendorId,
                        productId: item.id,
                        variantId: item.variantId,
                        quantity: currentQty - 1,
                      });
                    };

                    const handleIncrease = () => {
                      if (currentQty >= stock) return;
                      updateQty?.({
                        vendorId,
                        productId: item.id,
                        variantId: item.variantId,
                        quantity: currentQty + 1,
                      });
                    };

                    const handleRemove = () => {
                      remove?.({
                        vendorId,
                        productId: item.id,
                        variantId: item.variantId,
                      });
                    };

                    const priceNumber = toNumber(item.price);

                    return (
                      <div
                        key={`${item.id}-${item.variantId ?? "default"}`}
                        className="flex items-center justify-between mb-3"
                      >
                        {/* Product Info */}
                        <div className="flex items-center gap-3 w-[70%]">
                          <div className="relative w-12 h-12 flex-shrink-0">
                            <Image
                              src={imageSrc}
                              alt={item.name}
                              fill
                              className="object-contain rounded-md"
                            />
                          </div>
                          <div className="truncate">
                            <h5 className="text-sm font-medium truncate">
                              {item.name}
                            </h5>
                            <span className="text-xs text-gray-500">
                              {item.sku}
                            </span>
                            <p className="text-xs text-gray-500">
                              ৳{formatPrice(priceNumber)}
                            </p>
                          </div>
                        </div>

                        {/* Quantity + Remove */}
                        <div className="flex items-center gap-2">
                          <button
                            disabled={currentQty <= 1}
                            onClick={handleDecrease}
                            className={`px-2 py-1 border rounded-md text-sm transition ${currentQty <= 1
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-100"
                              }`}
                          >
                            −
                          </button>

                          <span className="text-sm font-medium w-4 text-center">
                            {currentQty}
                          </span>

                          <button
                            disabled={currentQty >= stock}
                            onClick={handleIncrease}
                            className={`px-2 py-1 border rounded-md text-sm transition ${currentQty >= stock
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-100"
                              }`}
                          >
                            +
                          </button>

                          <button
                            onClick={handleRemove}
                            className="text-red-500 hover:text-red-700 ml-2"
                            aria-label="Remove"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {vendorKeysForRender.length > 0 && (
          <div className="border-t p-4 bg-white">
            <div className="flex justify-between font-medium mb-3">
              <span>Subtotal:</span>
              <span className="text-main font-bold">
                ৳{formatPrice(subtotalForRender)}
              </span>
            </div>

            <Link
              href="/cart"
              onClick={onClose}
              className="block text-center bg-main text-white py-2 rounded-lg hover:bg-main/90 transition"
            >
              Go to Cart →
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default MiniCartDrawer;
