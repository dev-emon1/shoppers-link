"use client";

import React, { useState } from "react";
import AddressCard from "./AddressCard";
import AddressModal from "./AddressModal";

export default function AddressList({ addresses, loading, customerId }) {
  const [editAddress, setEditAddress] = useState(null);

  if (!loading && addresses.length === 0) {
    return (
      <div className="text-sm text-textSecondary">
        You have not added any address yet.
      </div>
    );
  }

  return (
    <>
      {/* Responsive Grid */}
      <div
        className="
          grid grid-cols-1
          lg:grid-cols-2
          gap-4
        "
      >
        {addresses.map((address) => (
          <AddressCard
            key={address.id}
            address={address}
            onEdit={() => setEditAddress(address)}
          />
        ))}
      </div>

      {/* Edit Modal */}
      {editAddress && (
        <AddressModal
          open={true}
          mode="edit"
          customerId={customerId}
          initialData={editAddress}
          onClose={() => setEditAddress(null)}
        />
      )}
    </>
  );
}
