"use client";

import React, {
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useState,
} from "react";
import Link from "next/link";

/* ----------------------------------
   Sub Column
---------------------------------- */
const SubColumn = React.memo(function SubColumn({
  categorySlug,
  sub,
  onItemClick,
}) {
  const children = Array.isArray(sub?.children)
    ? sub.children
    : Array.isArray(sub?.child_categories)
    ? sub.child_categories
    : [];

  return (
    <div className="min-h-[40px]">
      <h4 className="font-semibold border-b border-border pb-2 mb-3 text-textPrimary select-none">
        {sub?.name}
      </h4>

      <ul className="space-y-2 text-textSecondary">
        {children.map((child) => (
          <li key={child?.id ?? child?.slug}>
            <Link
              href={`/${categorySlug}/${sub?.slug}/${child?.slug}`}
              onClick={onItemClick}
              className="hover:text-main hover:underline transition-all duration-150 block"
            >
              {child?.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
});

/* ----------------------------------
   Mega Menu
---------------------------------- */
const MegaMenu = ({
  categories = [],
  activeMenu,
  setActiveMenu,
  showTopBar,
}) => {
  /* ----------------------------------
     Scroll shadow state
  ---------------------------------- */
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    onScroll(); // initial
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cats = useMemo(
    () => (Array.isArray(categories) ? categories : []),
    [categories]
  );

  const openTimer = useRef(null);
  const closeTimer = useRef(null);

  /* ----------------------------------
     Close menu on link click
  ---------------------------------- */
  const closeMegaMenu = useCallback(() => {
    setActiveMenu(null);
  }, [setActiveMenu]);

  /* ----------------------------------
     Hover handlers
  ---------------------------------- */
  const handleMouseEnter = useCallback(
    (index) => {
      clearTimeout(closeTimer.current);
      openTimer.current = setTimeout(() => {
        setActiveMenu(index);
      }, 100);
    },
    [setActiveMenu]
  );

  const handleMouseLeave = useCallback(() => {
    clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  }, [setActiveMenu]);

  return (
    <nav
      className={`
        bg-bgSurface relative z-30
        transition-shadow duration-300 border-b border-border
        ${isScrolled ? "shadow-[0_4px_12px_rgba(0,0,0,0.08)]" : "shadow-none"}
      `}
      style={{ overflow: "visible" }}
    >
      <div className="container">
        <ul className="flex justify-center gap-5 xl:gap-8 text-[11px] xl:text-sm font-medium text-textPrimary relative">
          {cats.map((category, index) => {
            const subcategories = Array.isArray(category?.subcategories)
              ? category.subcategories
              : Array.isArray(category?.sub_categories)
              ? category.sub_categories
              : [];

            return (
              <li
                key={category?.id ?? category?.slug ?? index}
                className="relative py-3 cursor-pointer"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Category link */}
                <Link
                  href={`/${category?.slug}`}
                  className="hover:text-main transition-all duration-200 select-none"
                  aria-haspopup={subcategories.length > 0 ? "true" : "false"}
                  aria-expanded={activeMenu === index}
                >
                  {category?.name}
                </Link>

                {/* Mega panel */}
                {activeMenu === index && subcategories.length > 0 && (
                  <div
                    className="
                      fixed left-1/2 -translate-x-1/2 w-full
                      bg-white border-t border-border
                      shadow-[0_12px_24px_rgba(0,0,0,0.08)]
                      py-10 px-6 z-[900]
                    "
                    style={{
                      top: showTopBar ? "140px" : "108px",
                      transition: "top 0.25s ease",
                      pointerEvents: "auto",
                    }}
                    onMouseEnter={() => {
                      clearTimeout(closeTimer.current);
                    }}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="max-w-[1400px] mx-auto">
                      <div
                        className="
                          grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6
                          gap-8 text-xs max-h-[70vh] overflow-auto pr-4
                        "
                        style={{ paddingBottom: 28 }}
                      >
                        {subcategories.map((sub) => (
                          <SubColumn
                            key={sub?.id ?? sub?.slug}
                            categorySlug={category?.slug}
                            sub={sub}
                            onItemClick={closeMegaMenu}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default React.memo(MegaMenu);
