"use client";

import { useState } from "react";
import RequireAuth from "@/components/auth/RequireAuth";
import DashboardSidebar from "@/modules/user/dashboard/DashboardSidebar";
import DashboardMobileSidebar from "@/modules/user/dashboard/DashboardMobileSidebar";

export default function DashboardLayout({ children }) {
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  return (
    <RequireAuth>
      <div className="min-h-screen bg-gray-50 flex pt-[40px]">
        {/* Desktop Sidebar */}
        <DashboardSidebar />

        {/* Mobile Sidebar */}
        <DashboardMobileSidebar
          open={openMobileMenu}
          onClose={() => setOpenMobileMenu(false)}
        />

        {/* Main content */}
        <div className="flex-1">
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-main"
            onClick={() => setOpenMobileMenu(true)}
          >
            ☰ Menu
          </button>

          <div className="p-2 md:p-4">{children}</div>
        </div>
      </div>
    </RequireAuth>
  );
}
