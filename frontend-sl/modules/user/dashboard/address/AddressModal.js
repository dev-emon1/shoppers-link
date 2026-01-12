"use client";

import React, { useEffect, useState } from "react";
import { useAddresses } from "@/modules/user/hooks/useAddresses";

export default function AddressModal({
  open,
  onClose,
  customerId,
  mode = "add",
  initialData = null,
}) {
  const { createAddress, editAddress, loading } = useAddresses(customerId);

  const [form, setForm] = useState({
    address_type: "home",
    address_line1: "",
    address_line2: "",
    area: "",
    city: "",
    postal_code: "",
    is_default: false,
  });

  /* ==============================
     Prefill on EDIT
  ================================ */
  useEffect(() => {
    if (mode === "edit" && initialData) {
      setForm({
        address_type: initialData.address_type,
        address_line1: initialData.address_line1,
        address_line2: initialData.address_line2 || "",
        area: initialData.area,
        city: initialData.city,
        postal_code: initialData.postal_code,
        is_default: initialData.is_default,
      });
    }
  }, [mode, initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.address_type ||
      !form.address_line1 ||
      !form.area ||
      !form.city ||
      !form.postal_code
    ) {
      alert("Please fill all required fields");
      return;
    }

    const payload = {
      ...form,
      country: "Bangladesh",
      state: null, // deprecated
    };

    if (mode === "edit") {
      await editAddress(initialData.id, payload);
    } else {
      await createAddress({
        customer_id: customerId,
        ...payload,
      });
    }

    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-lg rounded-lg p-6 space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            {mode === "edit" ? "Edit Address" : "Add New Address"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Address Type */}
          <div>
            <label className="block text-sm font-medium">Address Type *</label>
            <select
              name="address_type"
              value={form.address_type}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-sm"
            >
              <option value="home">Home</option>
              <option value="office">Office</option>
            </select>
          </div>

          {/* Address Line 1 */}
          <input
            type="text"
            name="address_line1"
            value={form.address_line1}
            onChange={handleChange}
            placeholder="House, Road, Block *"
            className="w-full border rounded px-3 py-2 text-sm"
          />

          {/* Address Line 2 */}
          <input
            type="text"
            name="address_line2"
            value={form.address_line2}
            onChange={handleChange}
            placeholder="Apartment, Floor (optional)"
            className="w-full border rounded px-3 py-2 text-sm"
          />

          {/* Area / City */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              name="area"
              value={form.area}
              onChange={handleChange}
              placeholder="Area / Thana *"
              className="border rounded px-3 py-2 text-sm"
            />
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City / District *"
              className="border rounded px-3 py-2 text-sm"
            />
          </div>

          {/* Postcode */}
          <input
            type="text"
            name="postal_code"
            value={form.postal_code}
            onChange={handleChange}
            placeholder="Postcode *"
            className="w-full border rounded px-3 py-2 text-sm"
          />

          {/* Default */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="is_default"
              checked={form.is_default}
              onChange={handleChange}
            />
            Set as default address
          </label>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm border rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : mode === "edit"
                ? "Update Address"
                : "Save Address"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
