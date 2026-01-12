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
  const [activeIndex, setActiveIndex] = useState(-1);

  /* 🔑 SEARCH (backend limited preview) */
  const { items, total, loading, isEmpty } = useSearchProducts({
    query,
    debounce: 300,
    categoryId,
    limit: MAX_PREVIEW,
  });

  const safeTotal = useMemo(() => {
    if (Array.isArray(total)) return total[0];
    return Number(total) || items.length;
  }, [total, items.length]);

  /* load recent searches */
  useEffect(() => {
    if (isOpen) {
      setRecent(getRecentSearches());
      setActiveIndex(-1);
    }
  }, [isOpen, query]);

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

  /* ⌨️ KEYBOARD NAVIGATION */
  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(e) {
      const list = query ? items : recent;
      if (!list.length) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => (i < list.length - 1 ? i + 1 : 0));
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => (i > 0 ? i - 1 : list.length - 1));
      }

      if (e.key === "Enter" && activeIndex >= 0) {
        e.preventDefault();

        if (query) {
          const product = items[activeIndex];
          if (!product) return;
          saveRecentSearch(query);
          router.push(buildProductUrl(product));
        } else {
          const q = recent[activeIndex];
          if (!q) return;
          saveRecentSearch(q);
          router.push(`/search?q=${encodeURIComponent(q)}`);
        }

        onClose();
      }

      if (e.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, activeIndex, items, recent, query]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={containerRef}
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 0.18 }}
        className="
          absolute left-0 right-0 top-full mt-2 z-[999]
          bg-white border border-gray-200 shadow-xl
          rounded-lg overflow-hidden
          max-h-[70vh] md:max-h-[420px]
        "
      >
        <div className="max-h-[70vh] md:max-h-[420px] overflow-y-auto">
          {/* ---------------- EMPTY QUERY ---------------- */}
          {!query && (
            <div className="p-4">
              <h4 className="text-xs font-semibold text-gray-500 mb-3">
                Recent Searches
              </h4>

              {recent.length === 0 && (
                <p className="text-sm text-gray-400">No recent searches</p>
              )}

              <ul className="space-y-1">
                {recent.map((q, idx) => (
                  <li key={q}>
                    <button
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => {
                        saveRecentSearch(q);
                        router.push(`/search?q=${encodeURIComponent(q)}`);
                        onClose();
                      }}
                      className={`
                        w-full text-left px-2 py-1.5 rounded
                        text-sm transition
                        ${
                          activeIndex === idx
                            ? "bg-main/10 text-main"
                            : "hover:bg-gray-100"
                        }
                      `}
                    >
                      {q}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* ---------------- QUERY RESULT ---------------- */}
          {query && (
            <>
              {loading && (
                <div className="py-6 flex justify-center">
                  <Loader size="sm" />
                </div>
              )}

              {!loading && isEmpty && (
                <div className="py-10 text-center text-sm text-gray-500">
                  No products found for <b>{query}</b>
                </div>
              )}

              {!loading && items.length > 0 && (
                <>
                  <ul className="divide-y">
                    {items.map((product, idx) => {
                      const imagePath =
                        product.primary_image ||
                        product.images?.find((img) => img.is_primary)
                          ?.image_path ||
                        product.images?.[0]?.image_path ||
                        "";

                      return (
                        <li
                          key={product.id}
                          onMouseEnter={() => setActiveIndex(idx)}
                          onClick={() => {
                            saveRecentSearch(query);
                            router.push(buildProductUrl(product));
                            onClose();
                          }}
                          className={`
                            flex items-center gap-4 px-4 py-3
                            cursor-pointer transition
                            ${
                              activeIndex === idx
                                ? "bg-main/10"
                                : "hover:bg-main/5"
                            }
                          `}
                        >
                          <div className="relative w-14 h-14 rounded bg-gray-100 overflow-hidden">
                            <Image
                              src={makeImageUrl(imagePath)}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          </div>

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
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SearchDropdown;
