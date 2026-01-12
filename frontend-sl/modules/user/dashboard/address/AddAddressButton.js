"use client";

import React, { useState } from "react";
import AddressModal from "./AddressModal";

export default function AddAddressButton({ customerId, disabled }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        disabled={disabled}
        onClick={() => setOpen(true)}
        className="text-sm text-blue-600 hover:underline disabled:text-gray-400"
      >
        Add Address
      </button>

      <AddressModal
        open={open}
        onClose={() => setOpen(false)}
        customerId={customerId}
      />
    </>
  );
}
