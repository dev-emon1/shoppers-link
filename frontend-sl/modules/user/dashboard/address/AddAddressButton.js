"use client";

import React, { useState } from "react";
import AddressModal from "./AddressModal";

export default function AddAddressButton({ customerId, disabled }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative group inline-block">
      <button
        disabled={disabled}
        onClick={() => !disabled && setOpen(true)}
        className={`text-sm font-medium transition
          ${
            disabled
              ? "text-textLight cursor-not-allowed"
              : "text-main hover:underline"
          }`}
      >
        Add Address
      </button>

      {/* Tooltip when disabled */}
      {disabled && (
        <div
          className="absolute -top-8 left-1/2 -translate-x-1/2
                     hidden group-hover:block
                     whitespace-nowrap
                     rounded-md bg-textPrimary text-textWhite
                     text-xs px-3 py-1 shadow-lg z-50"
        >
          You can add maximum 2 addresses
        </div>
      )}

      {/* Modal */}
      <AddressModal
        open={open}
        onClose={() => setOpen(false)}
        customerId={customerId}
      />
    </div>
  );
}
