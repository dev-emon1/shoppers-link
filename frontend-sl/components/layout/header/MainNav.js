"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
  { text: "A concern of", logo: fingertipsLogo, alt: "Fingertips" },
  { text: "Powered by", logo: banglalinkLogo, alt: "Banglalink" },
];

const MainNav = ({
  isSearchOpen,
  setIsSearchOpen,
  showSidebar,
  setShowSidebar,
  isScrollingDown,
}) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { user } = useSelector((state) => state.auth || {});
  const [searchQuery, setSearchQuery] = useState("");
  const [searchCategoryId, setSearchCategoryId] = useState(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dropdownRef = useRef(null);
  const openTimer = useRef(null);
  const closeTimer = useRef(null);

  useOutsideClick(dropdownRef, () => setOpenDropdown(false));

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % BRAND_SEQUENCE.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  const handleSearchSubmit = () => {
    const q = searchQuery.trim();
    if (!q) return;

    setIsSearchOpen(false);
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const handleUserMouseEnter = () => {
    clearTimeout(closeTimer.current);
    openTimer.current = setTimeout(() => setOpenDropdown(true), 120);
  };

  const handleUserMouseLeave = () => {
    clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setOpenDropdown(false), 180);
  };

  const current = BRAND_SEQUENCE[currentIndex];

  return (
    <nav
      className={`relative z-50 bg-bgSurface transition-shadow ${
        isScrollingDown ? "shadow-[0_2px_12px_rgba(0,0,0,0.06)]" : ""
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between h-[68px] md:h-20">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <ShoppersLinkLogo width={85} height={45} />
            </Link>

            {/* Brand animation */}
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
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <SearchInput
              initialQuery={searchQuery}
              initialCategory={searchCategoryId}
              onOpen={() => setIsSearchOpen(true)}
              onClose={() => setIsSearchOpen(false)}
              onQueryChange={setSearchQuery}
              onCategoryChange={setSearchCategoryId}
            />
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            <WishlistIconButton />
            <CartIconButton />

            {/* User */}
            <div
              ref={dropdownRef}
              onMouseEnter={handleUserMouseEnter}
              onMouseLeave={handleUserMouseLeave}
              className="relative"
            >
              {!mounted || !user ? (
                <Link href="/user/login" className="flex items-center gap-1">
                  <User size={20} className="text-gray-600" />
                  <span className="hidden sm:block text-[11px] font-medium tracking-wide text-textPrimary group-hover:text-main">
                    Sign In
                  </span>
                </Link>
              ) : (
                <>
                  <button className="flex items-center gap-2">
                    {/* Avatar */}
                    {user?.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.user_name}
                        width={28}
                        height={28}
                        className="rounded-full object-cover border"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
                        <User size={16} className="text-gray-600" />
                      </div>
                    )}

                    {/* Name (desktop only) */}
                    <span className="hidden lg:inline text-sm font-medium text-gray-700 max-w-[90px] truncate">
                      {user.user_name}
                    </span>

                    <ChevronDown size={14} className="text-gray-500" />
                  </button>

                  <AnimatePresence>
                    {openDropdown && (
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border"
                      >
                        <Link
                          href="/user/dashboard"
                          className="block px-5 py-3 text-sm hover:bg-gray-50"
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/user/dashboard/orders"
                          className="block px-5 py-3 text-sm hover:bg-gray-50"
                        >
                          My Orders
                        </Link>
                        <hr />
                        <button
                          onClick={() => dispatch(logout())}
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

            {/* Mobile Menu */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition"
            >
              {showSidebar ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
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

      {/* Search Dropdown */}
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
