"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import useSearchProducts from "../hooks/useSearchProducts";
import { makeImageUrl } from "@/lib/utils/image";
import { buildProductUrl } from "@/lib/utils/buildProductUrl";
import Loader from "@/components/ui/Loader";

/* ----------------------------------
   CONFIG
----------------------------------- */
const MAX_PREVIEW = 2;
const RECENT_KEY = "recent_searches";

/* ----------------------------------
   helpers
----------------------------------- */
function getRecentSearches() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
  } catch {
    return [];
  }
}

function saveRecentSearch(q) {
  if (!q) return;
  const list = getRecentSearches();
  const updated = [q, ...list.filter((i) => i !== q)].slice(0, 5);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
}

/* ----------------------------------
   COMPONENT
----------------------------------- */
const SearchDropdown = ({ isOpen, query, onClose, onViewAll, categoryId }) => {
  const router = useRouter();
  const containerRef = useRef(null);

  const [recent, setRecent] = useState([]);

  /* fetch search result */
  const { items, total, loading, isEmpty } = useSearchProducts({
    query,
    debounce: 300,
    categoryId,
  });

  const safeTotal = Array.isArray(total)
    ? total[0]
    : Number(total) || items.length;

  /* frontend slice (backend limit no) */
  const previewItems = useMemo(() => items.slice(0, MAX_PREVIEW), [items]);

  /* load recent search on open */
  useEffect(() => {
    if (isOpen) {
      setRecent(getRecentSearches());
    }
  }, [isOpen]);

  /* outside click close */
  useEffect(() => {
    function handleClick(e) {
      if (!containerRef.current?.contains(e.target)) {
        onClose?.();
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.2 }}
        className="
          absolute left-0 right-0 top-full mt-2 z-[999]
          bg-white rounded-2xl shadow-2xl border
          overflow-hidden
        "
      >
        {/* ----------------------------------
            EMPTY QUERY → SUGGESTIONS
        ----------------------------------- */}
        {!query && (
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent */}
            <div>
              <h4 className="text-xs font-semibold text-gray-500 mb-3">
                Recent Searches
              </h4>

              {recent.length === 0 && (
                <p className="text-sm text-gray-400">No recent searches</p>
              )}

              <ul className="space-y-2">
                {recent.map((q) => (
                  <li key={q}>
                    <button
                      onClick={() => {
                        saveRecentSearch(q);
                        router.push(`/search?q=${encodeURIComponent(q)}`);
                        onClose();
                      }}
                      className="text-sm hover:text-main transition"
                    >
                      {q}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ----------------------------------
            TYPING → PRODUCT RESULT
        ----------------------------------- */}
        {query && (
          <>
            {/* loading */}
            {loading && (
              <div className="py-8 flex justify-center">
                <Loader size="sm" />
              </div>
            )}

            {/* empty */}
            {!loading && isEmpty && (
              <div className="py-10 text-center text-sm text-gray-500">
                No products found for <b>{query}</b>
              </div>
            )}

            {/* results */}
            {!loading && previewItems.length > 0 && (
              <>
                <ul className="divide-y">
                  {previewItems.map((product) => {
                    const href = buildProductUrl(product);

                    const imagePath =
                      product.primary_image ||
                      product.images?.find((img) => img.is_primary)
                        ?.image_path ||
                      product.images?.[0]?.image_path ||
                      "";

                    const imageSrc = makeImageUrl(imagePath);

                    return (
                      <li
                        key={product.id}
                        onClick={() => {
                          saveRecentSearch(query);
                          router.push(href);
                          onClose();
                        }}
                        className="
                          flex items-center gap-4 px-4 py-3
                          cursor-pointer hover:bg-gray-50 transition
                        "
                      >
                        {/* image */}
                        <div className="relative w-14 h-14 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                          <Image
                            src={imageSrc}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* info */}
                        <div className="flex-1">
                          <p className="text-sm font-medium line-clamp-1">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            ৳ {Number(product.price).toLocaleString()}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {/* view all */}
                {safeTotal > MAX_PREVIEW && (
                  <button
                    onClick={() => {
                      saveRecentSearch(query);
                      onViewAll();
                      onClose();
                    }}
                    className="
                      w-full py-3 text-sm font-medium
                      text-main hover:bg-main/5
                      border-t
                    "
                  >
                    View all results ({safeTotal})
                  </button>
                )}
              </>
            )}
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchDropdown;
