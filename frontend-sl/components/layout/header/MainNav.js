"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, User, Menu, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ShoppersLinkLogo from "@/components/ui/Logo";
import CartIconButton from "@/components/cart/CartIconButton";
import WishlistIconButton from "@/components/wishlist/WishlistIconButton";
import SearchInput from "@/modules/search/components/SearchInput";
import SearchDropdown from "@/modules/search/components/SearchDropdown";

import banglalinkLogo from "@/public/svg/banglalink.svg";
import fingertipsLogo from "@/public/svg/fingertips.svg";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/modules/user/store/authReducer";
import { useOutsideClick } from "@/lib/utils/useOutSideClick";

const BRAND_SEQUENCE = [
  {
    text: "A concern of",
    logo: fingertipsLogo,
    alt: "Fingertips",
  },
  {
    text: "Powered by",
    logo: banglalinkLogo,
    alt: "Banglalink",
  },
];

const MainNav = ({
  isSearchOpen,
  setIsSearchOpen,
  showSidebar,
  setShowSidebar,
  isScrollingDown,
}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});
  const [currentIndex, setCurrentIndex] = useState(0);
  const dropdownRef = useRef(null);
  const openTimer = useRef(null);
  const closeTimer = useRef(null);
  const [openDropdown, setOpenDropdown] = useState(false);

  const [mounted, setMounted] = useState(false);

  // Outside click for user dropdown
  useOutsideClick(dropdownRef, () => setOpenDropdown(false));

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BRAND_SEQUENCE.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const current = BRAND_SEQUENCE[currentIndex];

  const handleUserMouseEnter = () => {
    clearTimeout(closeTimer.current);
    openTimer.current = setTimeout(() => {
      setOpenDropdown(true);
    }, 120);
  };

  const handleUserMouseLeave = () => {
    clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => {
      setOpenDropdown(false);
    }, 180);
  };

  return (
    <nav
      className={`relative z-50 bg-bgSurface transition-shadow duration-300 ${
        isScrollingDown ? "shadow-sm" : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* LEFT: Logo + Brand */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <ShoppersLinkLogo width={85} height={45} />
            </Link>

            {/* Desktop & Tablet: Animated brand with fixed width to prevent shift */}
            <div className="hidden sm:block w-[180px] min-w-[180px]">
              <div className="flex items-center gap-3 text-xs text-gray-600 font-medium h-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="flex items-center gap-3 whitespace-nowrap"
                  >
                    <span>{current.text}</span>
                    <Image
                      src={current.logo}
                      alt={current.alt}
                      width={62}
                      height={24}
                      className="object-contain"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Mobile: Static small version */}
            <div className="flex sm:hidden items-center gap-2 text-[10px] text-gray-600 font-medium">
              <span>Powered by</span>
              <Image
                src={banglalinkLogo}
                alt="Banglalink"
                width={50}
                height={20}
                className="object-contain"
              />
            </div>
          </div>

          {/* CENTER: Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-2xl mx-8">
            <SearchInput
              onOpen={() => setIsSearchOpen(true)}
              onClose={() => setIsSearchOpen(false)}
              onQueryChange={() => {}}
            />
          </div>

          {/* RIGHT: Icons + User + Mobile Menu */}
          <div className="flex items-center gap-4 lg:gap-6">
            <WishlistIconButton />
            <CartIconButton />

            {/* User Menu */}
            <div
              className="relative"
              ref={dropdownRef}
              onMouseEnter={handleUserMouseEnter}
              onMouseLeave={handleUserMouseLeave}
            >
              {!mounted ? null : !user ? (
                <Link
                  href="/user/login"
                  className="hidden sm:flex items-center gap-1.5 hover:text-orange-600 transition-colors"
                >
                  <User size={20} />
                  <span className="text-sm font-medium">Sign In</span>
                </Link>
              ) : (
                <>
                  <button
                    type="button"
                    className="flex items-center gap-1.5 hover:text-orange-600 transition-colors"
                  >
                    <User size={20} />
                    <span className="text-sm font-medium hidden sm:inline">
                      {user.user_name?.split(" ")[0] || "Account"}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-200 ${
                        openDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {openDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50"
                      >
                        <Link
                          href="/user/dashboard"
                          onClick={() => setOpenDropdown(false)}
                          className="block px-5 py-3 text-sm hover:bg-gray-50"
                        >
                          Dashboard
                        </Link>

                        <Link
                          href="/user/dashboard/orders"
                          onClick={() => setOpenDropdown(false)}
                          className="block px-5 py-3 text-sm hover:bg-gray-50"
                        >
                          My Orders
                        </Link>

                        <hr className="my-1 border-gray-200" />

                        <button
                          onClick={() => {
                            setOpenDropdown(false);
                            dispatch(logout());
                          }}
                          className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden"
            >
              {showSidebar ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-3 pb-3">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="What do you need?"
              onFocus={() => setIsSearchOpen(true)}
              className="w-full px-4 py-2.5 text-sm outline-none"
            />
            <button className="bg-orange-600 text-white px-5 py-2.5 flex items-center justify-center">
              <Search size={20} />
            </button>
          </div>
        </div>
      </div>

      {mounted && (
        <SearchDropdown
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          query=""
        />
      )}
    </nav>
  );
};

export default MainNav;
