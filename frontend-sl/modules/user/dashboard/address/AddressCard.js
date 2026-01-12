"use client";

import React from "react";

export default function AddressCard({ address }) {
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
    <div className="border rounded-md p-4 space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium capitalize">{address_type}</div>

        {is_default && (
          <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">
            Default
          </span>
        )}
      </div>

      {/* Address lines */}
      <div className="text-sm text-gray-700">
        {address_line1}
        {address_line2 && <span>, {address_line2}</span>}
      </div>

      <div className="text-sm text-gray-600">
        {area}, {city}
      </div>

      <div className="text-sm text-gray-600">
        {postal_code}, {country}
      </div>
    </div>
  );
}
