"use client";

import TreeSidebar from "./TreeSidebar";
import FilterSidebar from "./FilterSidebar";
import MobileFilterDrawer from "./MobileFilterDrawer";

/**
 * ListingSidebar
 *
 * mode:
 * - "tree"   → Category / Subcategory navigation
 * - "filter" → Product filtering (PLP)
 */
export default function ListingSidebar({
  mode = "tree",

  /* tree props */
  category,
  tree,
  active,

  /* filter props */
  filters,
  selected,
  onFilterChange,

  /* mobile */
  mobileOpen = false,
  onCloseMobile = () => {},
}) {
  const content =
    mode === "filter" ? (
      <FilterSidebar
        filters={filters}
        selected={selected}
        onFilterChange={onFilterChange}
      />
    ) : (
      <TreeSidebar category={category} tree={tree} active={active} />
    );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block">{content}</aside>

      {/* Mobile Drawer */}
      <MobileFilterDrawer open={mobileOpen} onClose={onCloseMobile}>
        {content}
      </MobileFilterDrawer>
    </>
  );
}
