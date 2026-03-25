"use client";

import { Home, Building2, Plus, Pencil } from "lucide-react";
import { useSelector } from "react-redux";
import useCachedAddresses from "@/modules/user/hooks/useCachedAddresses";

export default function AddressSelector({
  selectedAddressId,
  onSelect,
  onAddNew,
  onEdit,
}) {
  const { user } = useSelector((state) => state.auth);
  const { addresses, loading } = useCachedAddresses(user?.customer?.id);

  if (loading) {
    return <p className="text-sm text-gray-500">Loading addresses...</p>;
  }

  const canAddMore = addresses.length < 2;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Select Address</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {addresses.map((addr) => {
          const isActive = selectedAddressId === addr.id;

          return (
            <div
              key={addr.id}
              onClick={() => onSelect(addr)} // 🔥 FULL CARD CLICKABLE
              className={`cursor-pointer rounded-xl border p-3 transition ${
                isActive
                  ? "border-main bg-main/5"
                  : "border-border bg-white hover:border-main/40"
              }`}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2 text-sm font-medium capitalize">
                  {addr.address_type === "home" ? (
                    <Home size={14} />
                  ) : (
                    <Building2 size={14} />
                  )}
                  {addr.address_type}
                </div>

                <div className="flex items-center gap-2">
                  {/* ✏️ Edit */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // 🔥 IMPORTANT (prevent select)
                      onEdit(addr);
                    }}
                    className="text-xs text-gray-500 hover:text-main"
                  >
                    <Pencil size={14} />
                  </button>

                  {/* Default badge */}
                  {addr.is_default === 1 && (
                    <span className="text-xs bg-main/10 text-main px-2 py-0.5 rounded">
                      Default
                    </span>
                  )}
                </div>
              </div>

              {/* Address */}
              <p className="text-xs text-gray-600">
                {addr.address_line1}, {addr.area}
              </p>
              <p className="text-xs text-gray-500">
                {addr.city} {addr.postal_code}
              </p>
            </div>
          );
        })}
      </div>

      {/* ➕ Add new */}
      <button
        type="button"
        disabled={!canAddMore}
        onClick={onAddNew}
        className={`flex items-center gap-2 text-sm ${
          canAddMore
            ? "text-main hover:underline"
            : "text-gray-400 cursor-not-allowed"
        }`}
      >
        <Plus size={14} /> Add new address
      </button>

      {!canAddMore && (
        <p className="text-xs text-gray-500">
          You can add maximum 2 addresses (Home & Office).
        </p>
      )}
    </div>
  );
}
