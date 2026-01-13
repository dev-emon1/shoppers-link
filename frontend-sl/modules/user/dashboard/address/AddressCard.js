"use client";

import React from "react";
import { Pencil } from "lucide-react";

export default function AddressCard({ address, onEdit }) {
  const {
    address_type,
    address_line1,
    address_line2,
    area,
    city,
    postal_code,
    country,
    is_default,
  } = address;

  return (
    <div
      className={`rounded-xl border border-border bg-bgSurface p-4 space-y-3
        ${is_default ? "ring-1 ring-main/40" : ""}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold capitalize text-textPrimary">
            {address_type}
          </span>
          {is_default === 1 && (
            <span
              className="text-[11px] px-2 py-0.5 rounded-full
                 bg-mainSoft text-main font-medium"
            >
              Default
            </span>
          )}
        </div>

        {/* Edit button */}
        <button
          onClick={onEdit}
          className="flex items-center gap-1 text-xs text-secondary
                     hover:text-secondaryHover"
        >
          <Pencil size={14} />
          Edit
        </button>
      </div>

      {/* Address */}
      <div className="text-sm text-textSecondary leading-relaxed">
        <div>
          {address_line1}
          {address_line2 && `, ${address_line2}`}
        </div>
        <div>
          {area}, {city}
        </div>
        <div>
          {postal_code}, {country}
        </div>
      </div>
    </div>
  );
}
