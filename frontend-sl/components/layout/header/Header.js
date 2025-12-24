"use client";

import React, { useEffect, useState } from "react";
import TopBar from "./TopBar";
import MainNav from "./MainNav";
import MegaMenu from "./MegaMenu";
import MobileMenu from "./MobileMenu";
import useScrollNavbar from "@/core/hooks/useScrollNavbar";
import { useDispatch, useSelector } from "react-redux";
import { loadAllCategories } from "@/modules/category/store/categoryReducer";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [showSidebar, setShowSidebar] = useState(false);

  const { showTopBar, isScrollingDown } = useScrollNavbar(80);
  const dispatch = useDispatch();

  const { items: categories = [] } = useSelector(
    (state) => state.category || {}
  );

  useEffect(() => {
    dispatch(loadAllCategories());
  }, [dispatch]);

  return (
    <header className="fixed top-0 left-0 w-full z-[999] bg-bgSurface shadow-sm">
      {/* Top Bar */}
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

      {/* Mega Menu */}
      <MegaMenu
        categories={categories}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        showTopBar={showTopBar}
      />

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        menuItems={categories}
      />
    </header>
  );
};

export default Header;
