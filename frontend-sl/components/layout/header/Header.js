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

  const { items: categories = [], loading } = useSelector(
    (state) => state.category || {}
  );

  useEffect(() => {
    dispatch(loadAllCategories());
  }, [dispatch]);

  return (
    <header className="fixed top-0 left-0 w-full z-[999] bg-bgSurface transition-all duration-300 shadow-sm">
      <div
        className={`transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${
          showTopBar
            ? "opacity-100 max-h-[32px] translate-y-0"
            : "opacity-0 max-h-0 -translate-y-3"
        }`}
      >
        <TopBar />
      </div>

      <MainNav
        isSearchOpen={isSearchOpen}
        setIsSearchOpen={setIsSearchOpen}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        isScrollingDown={isScrollingDown}
      />

      {/* pass categories fetched from redux */}
      <MegaMenu
        categories={categories}
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        showTopBar={showTopBar}
      />

      <MobileMenu
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        menuItems={categories}
      />
    </header>
  );
};

export default Header;
