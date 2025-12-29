// use client
"use client";
import React, { useRef, useMemo, useCallback } from "react";
import Link from "next/link";

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
    <div key={sub?.id} className="min-h-[40px]">
      <h4 className="font-semibold border-b border-border pb-2 mb-3 text-textPrimary cursor-default">
        {sub?.name}
      </h4>

      <ul className="space-y-2 text-textSecondary">
        {children.map((child) => (
          <li key={child?.id}>
            <Link
              href={`/${categorySlug}/${sub?.slug}/${child?.slug}`}
              onClick={onItemClick()}
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

/**
 * MegaMenu main
 * - Click on category label navigates to category page (no toggle)
 * - Hover opens the mega menu (same as before)
 */
const MegaMenu = ({
  categories = [],
  activeMenu,
  setActiveMenu,
  showTopBar,
}) => {
  const cats = useMemo(
    () => (Array.isArray(categories) ? categories : []),
    [categories]
  );

  const openTimer = useRef(null);
  const closeTimer = useRef(null);

  const closeMegaMenuOnClick = useCallback(
    (cb) => (e) => {
      cb?.(e);
      setActiveMenu(null);
    },
    [setActiveMenu]
  );

  const handleMouseEnter = useCallback(
    (index) => {
      clearTimeout(closeTimer.current);
      openTimer.current = setTimeout(() => setActiveMenu(index), 100);
    },
    [setActiveMenu]
  );

  const handleMouseLeave = useCallback(() => {
    clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setActiveMenu(null), 150);
  }, [setActiveMenu]);

  // removed toggle-on-click behavior; clicking should navigate to category page
  // keep function only if you want keyboard activation later
  const handleCategoryMouseDown = useCallback((e) => {
    // prevent focus/drag issues on some browsers if needed
    // but do not prevent default navigation
    e.stopPropagation();
  }, []);

  return (
    <nav
      className="border-b border-border bg-bgSurface relative z-30 hidden md:block"
      style={{ overflow: "visible" }}
    >
      <div className="container">
        <ul className="flex justify-center gap-8 text-sm font-medium text-textPrimary relative">
          {cats.map((category, index) => {
            const subcategories = Array.isArray(category?.subcategories)
              ? category.subcategories
              : Array.isArray(category?.sub_categories)
              ? category.sub_categories
              : [];

            return (
              <li
                key={category?.id ?? index}
                className="relative group py-3 cursor-pointer"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={() => handleMouseLeave()}
              >
                <Link
                  href={`/${category?.slug}`}
                  onMouseDown={handleCategoryMouseDown}
                  className="hover:text-main transition-all duration-200 select-none"
                  aria-haspopup={subcategories.length > 0 ? "true" : "false"}
                  aria-expanded={activeMenu === index}
                >
                  {category?.name}
                </Link>

                {activeMenu === index && subcategories.length > 0 && (
                  <div
                    className="fixed left-1/2 transform -translate-x-1/2 w-full bg-white shadow-xl border-t border-border py-10 px-6 z-[9999]"
                    style={{
                      top: showTopBar ? "140px" : "108px",
                      transition: "top 0.25s ease",
                      pointerEvents: "auto",
                    }}
                    onMouseEnter={() => {
                      clearTimeout(closeTimer.current);
                    }}
                    onMouseLeave={() => handleMouseLeave()}
                  >
                    <div className="max-w-[1400px] mx-auto">
                      <div
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8 text-xs max-h-[70vh] overflow-auto pr-4"
                        style={{ paddingBottom: 28 }}
                      >
                        {subcategories.map((sub) => (
                          <SubColumn
                            key={sub?.id}
                            categorySlug={category?.slug}
                            sub={sub}
                            onItemClick={closeMegaMenuOnClick}
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
