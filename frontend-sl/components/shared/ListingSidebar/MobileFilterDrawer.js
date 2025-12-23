"use client";

import { X } from "lucide-react";

/**
 * MobileFilterDrawer
 *
 * Controlled drawer for mobile filters
 */
export default function MobileFilterDrawer({ open, onClose, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Drawer */}
      <div
        className="
          absolute right-0 top-0 h-full w-[85%] max-w-sm
          bg-white shadow-xl flex flex-col
          animate-slideIn
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="text-base font-semibold">Filters</h3>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">{children}</div>
      </div>
    </div>
  );
}
