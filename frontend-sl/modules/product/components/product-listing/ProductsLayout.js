"use client";

import React from "react";

/**
 * ProductsLayout
 *
 * Desktop:
 * - Sidebar (left)
 * - Content (right)
 *
 * Mobile:
 * - Sidebar exists only for Drawer (not visible)
 */
const ProductsLayout = ({ sidebar, topbar, children }) => {
  return (
    <section className="container">
      {/* Topbar */}
      {topbar && <div className="mb-4">{topbar}</div>}

      {/* Main Layout */}
      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        {sidebar && (
          <aside className="hidden lg:block w-[260px] shrink-0">
            {sidebar}
          </aside>
        )}

        {/* Content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>

      {/* 🔥 IMPORTANT: Mobile Drawer Mount Point */}
      {/* Sidebar is rendered again ONLY to keep drawer alive */}
      <div className="lg:hidden">{sidebar}</div>
    </section>
  );
};

export default ProductsLayout;
