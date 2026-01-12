"use client";

import React from "react";
import { useSelector } from "react-redux";
import { useAddresses } from "@/modules/user/hooks/useAddresses";
import AddressList from "@/modules/user/dashboard/address/AddressList";
import AddAddressButton from "@/modules/user/dashboard/address/AddAddressButton";

export default function AddressPage() {
  const user = useSelector((state) => state.auth.user);
  const customerId = user?.customer?.id;

  const { addresses, loading, error } = useAddresses(customerId);

  if (!customerId) {
    return (
      <div className="p-6 text-sm text-gray-600">
        Customer profile not found.
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">My Addresses</h1>

        {/* Form comes next phase */}
        <AddAddressButton
          customerId={customerId}
          disabled={addresses.length >= 3}
        />
      </div>

      {/* Error */}
      {error && <div className="text-sm text-red-600">{error}</div>}

      {/* List */}
      <AddressList addresses={addresses} loading={loading} />
    </div>
  );
}
