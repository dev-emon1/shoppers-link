"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, X, User, Menu, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";

import ShoppersLinkLogo from "@/components/ui/Logo";
import CartIconButton from "@/components/cart/CartIconButton";
import WishlistIconButton from "@/components/wishlist/WishlistIconButton";

import SearchInput from "@/modules/search/components/SearchInput";
import SearchDropdown from "@/modules/search/components/SearchDropdown";

import banglalinkLogo from "@/public/svg/banglalink.svg";
import fingertipsLogo from "@/public/svg/fingertips.svg";

import { useOutsideClick } from "@/lib/utils/useOutSideClick";
import { makeImageUrl } from "@/lib/utils/image";
import useMediaQuery from "@/core/hooks/useMediaQuery";
import useLogout from "@/modules/user/hooks/useLogout";

const BRAND_SEQUENCE = [
  { text: "A concern of", logo: fingertipsLogo, alt: "Fingertips" },
  { text: "Powered by", logo: banglalinkLogo, alt: "Banglalink" },
];

const MainNav = ({
  isSearchOpen,
  setIsSearchOpen,
  showSidebar,
  setShowSidebar,
}) => {
  const router = useRouter();
  const { logout } = useLogout();

  const { user } = useSelector((state) => state.auth || {});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategoryId, setSearchCategoryId] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dropdownRef = useRef(null);
  const openTimer = useRef(null);
  const closeTimer = useRef(null);

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  /* -------------------- FIX 1: hydration -------------------- */
  useEffect(() => {
    setMounted(true);
  }, []);

  /* -------------------- brand animation -------------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BRAND_SEQUENCE.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  /* -------------------- responsive dropdown -------------------- */
  useEffect(() => {
    if (!isDesktop) {
      setOpenDropdown(false);
    }
  }, [isDesktop]);

  useOutsideClick(dropdownRef, () => {
    if (isDesktop) setOpenDropdown(false);
  });

  const current = BRAND_SEQUENCE[currentIndex];

  const handleSearchSubmit = () => {
    const q = searchQuery.trim();
    if (!q) return;
    setIsSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <nav className="relative z-50 bg-bgSurface">
      <div className="container px-0 lg:px-6">
        <div className="flex items-center justify-between h-[68px] md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <ShoppersLinkLogo width={85} height={45} />
            </Link>

            <div className="hidden sm:block w-[180px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.4 }}
                  className="flex items-center gap-3 text-xs text-gray-600"
                >
                  <span>{current.text}</span>
                  <Image src={current.logo} alt={current.alt} width={62} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
            <SearchInput
              initialQuery={searchQuery}
              initialCategory={searchCategoryId}
              onOpen={() => setIsSearchOpen(true)}
              onClose={() => setIsSearchOpen(false)}
              onQueryChange={setSearchQuery}
              onCategoryChange={setSearchCategoryId}
            />
          </div>

          {/* Right */}
          <div className="flex items-center gap-4">
            <WishlistIconButton />
            <CartIconButton />

            {/* User */}
            <div
              ref={dropdownRef}
              onMouseEnter={
                isDesktop && user
                  ? () => {
                      clearTimeout(closeTimer.current);
                      openTimer.current = setTimeout(
                        () => setOpenDropdown(true),
                        120
                      );
                    }
                  : undefined
              }
              onMouseLeave={
                isDesktop && user
                  ? () => {
                      clearTimeout(openTimer.current);
                      closeTimer.current = setTimeout(
                        () => setOpenDropdown(false),
                        180
                      );
                    }
                  : undefined
              }
              className="relative"
            >
              <button
                onClick={() => {
                  if (!user) {
                    router.push("/user/login");
                    return;
                  }

                  if (!isDesktop) {
                    setOpenDropdown((prev) => !prev); // ✅ mobile fix
                  }
                }}
                className="flex items-center gap-2"
              >
                {user?.customer?.profile_picture ? (
                  <Image
                    src={makeImageUrl(user.customer.profile_picture)}
                    alt={user?.user_name || "User"}
                    width={28}
                    height={28}
                    className="rounded-full object-cover border bg-gray-100"
                    unoptimized
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                    <User size={16} />
                  </div>
                )}

                {/* hydration-safe text */}
                {mounted && user ? (
                  <>
                    <span className="hidden lg:inline text-sm truncate max-w-[90px]">
                      {user.user_name}
                    </span>
                    <ChevronDown size={14} />
                  </>
                ) : (
                  <span className="hidden sm:block text-[11px] font-medium">
                    Sign In
                  </span>
                )}
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {user && openDropdown && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border z-50"
                  >
                    <Link
                      href="/user/dashboard"
                      className="block px-5 py-3 text-sm hover:bg-gray-50"
                      onClick={() => setOpenDropdown(false)}
                    >
                      Dashboard
                    </Link>

                    <Link
                      href="/user/dashboard/orders"
                      className="block px-5 py-3 text-sm hover:bg-gray-50"
                      onClick={() => setOpenDropdown(false)}
                    >
                      My Orders
                    </Link>

                    <hr />

                    <button
                      onClick={() => {
                        setOpenDropdown(false);
                        logout();
                      }}
                      className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-2 rounded-full hover:bg-gray-100"
            >
              {showSidebar ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="lg:hidden pb-3">
          <div className="flex border overflow-hidden">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit()}
              placeholder="What do you need?"
              className="flex-1 px-4 py-2.5 text-sm outline-none"
            />
            <button
              onClick={handleSearchSubmit}
              className="bg-main text-white px-4"
            >
              <Search size={18} />
            </button>
          </div>
        </div>
      </div>

      {mounted && (
        <SearchDropdown
          isOpen={isSearchOpen}
          query={searchQuery}
          categoryId={searchCategoryId}
          onClose={() => setIsSearchOpen(false)}
          onViewAll={handleSearchSubmit}
        />
      )}
    </nav>
  );
};

export default MainNav;
