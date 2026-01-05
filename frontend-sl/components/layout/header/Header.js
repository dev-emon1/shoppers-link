"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import TopBar from "./TopBar";
import MainNav from "./MainNav";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";

import useScrollNavbar from "@/core/hooks/useScrollNavbar";
import useMediaQuery from "@/core/hooks/useMediaQuery";
import { loadAllCategories } from "@/modules/category/store/categoryReducer";

const Header = () => {
  const dispatch = useDispatch();

  /* ----------------------------------
     UI State
  ---------------------------------- */
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  /* ----------------------------------
     Hooks
  ---------------------------------- */
  const { showTopBar, isScrollingDown } = useScrollNavbar(80);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const { items: categories = [] } = useSelector(
    (state) => state.category || {}
  );

  /* ----------------------------------
     Load categories once
  ---------------------------------- */
  useEffect(() => {
    dispatch(loadAllCategories());
  }, [dispatch]);

  /* ----------------------------------
     Auto close mobile menu on desktop
  ---------------------------------- */
  useEffect(() => {
    if (isDesktop && showSidebar) {
      setShowSidebar(false);
    }
  }, [isDesktop, showSidebar]);

  /* ----------------------------------
     Reset mega menu on mobile
  ---------------------------------- */
  useEffect(() => {
    if (!isDesktop) {
      setActiveMenu(null);
    }
  }, [isDesktop]);

  const headerRef = useRef(null);
  const [headerHeight, setHeaderHeight] = useState(0);

  useLayoutEffect(() => {
    if (!headerRef.current) return;
    setHeaderHeight(headerRef.current.offsetHeight);
  }, [isSearchOpen, showTopBar]);
  return (
    <header
      className="fixed top-0 left-0 w-full z-[999] bg-bgSurface"
      ref={headerRef}
    >
      {/* Top Bar (CSS handles hide till lg) */}
      <div
        className={`transition-all duration-300 ${
          showTopBar
            ? "opacity-100 max-h-[32px]"
            : "opacity-0 max-h-0 -translate-y-3"
        }`}
      >
        <TopBar />
      </div>

      {/* Main Navigation */}
      <MainNav
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        isScrollingDown={isScrollingDown}
      />

      {/* Desktop Mega Menu */}
      <div className="hidden lg:block">
        <MegaMenu
          categories={categories}
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          showTopBar={showTopBar}
        />
      </div>

      {/* Mobile / Tablet Menu */}
      {!isDesktop && (
        <MobileMenu
          isOpen={showSidebar}
          onClose={() => setShowSidebar(false)}
          menuItems={categories}
          offsetTop={headerHeight}
        />
      )}
    </header>
  );
};

export default Header;
