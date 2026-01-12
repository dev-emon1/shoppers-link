"use client";

import React from "react";
import AddressCard from "./AddressCard";

export default function AddressList({ addresses, loading, customerId }) {
  if (!loading && addresses.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        You have not added any address yet.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {addresses.map((address) => (
        <AddressCard
          key={address.id}
          address={address}
          customerId={customerId}
        />
      ))}
    </div>
  );
}
