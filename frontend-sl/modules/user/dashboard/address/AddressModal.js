"use client";

import React, { useEffect, useState } from "react";
import { useAddresses } from "@/modules/user/hooks/useAddresses";
import {
  validateAddressField,
  validateAddressForm,
} from "@/modules/user/utils/addressValidation";
import { CrossIcon, X } from "lucide-react";

export default function AddressModal({
  open,
  onClose,
  customerId,
  mode = "add",
  initialData = null,
}) {
  const { createAddress, editAddress, loading } = useAddresses(customerId);
  const [errors, setErrors] = useState({});

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
    const finalValue = type === "checkbox" ? checked : value;

    setForm((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    // real-time validation
    const error = validateAddressField(name, finalValue);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateAddressForm(form);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    const payload = {
      ...form,
      country: "Bangladesh",
      state: null,
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
    <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-black/50">
      {/* Modal */}
      <div className="z-[9999] w-full max-w-xl rounded-xl bg-bgSurface shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-mainSoft">
          <h2 className="text-lg font-semibold text-textPrimary">
            {mode === "edit" ? "Edit Address" : "Add New Address"}
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-md p-1 text-textSecondary
             hover:text-textPrimary hover:bg-mainSoft
             transition-colors"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Address Type */}
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1">
              Address Type *
            </label>
            <select
              name="address_type"
              value={form.address_type}
              onChange={handleChange}
              className="w-full rounded-lg border border-border bg-bgSurface px-3 py-2 text-sm
                       focus:border-main focus:ring-2 focus:ring-mainSoft outline-none"
            >
              <option value="home">Home</option>
              <option value="office">Office</option>
            </select>
          </div>

          {/* Address Line 1 */}
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1">
              Address *
            </label>

            <input
              type="text"
              name="address_line1"
              value={form.address_line1}
              onChange={handleChange}
              className={`w-full rounded-lg border px-3 py-2 text-sm outline-none
    ${
      errors.address_line1
        ? "border-red focus:ring-red/20"
        : "border-border focus:border-main focus:ring-mainSoft"
    }`}
            />

            {errors.address_line1 && (
              <p className="mt-1 text-xs text-red">{errors.address_line1}</p>
            )}
          </div>

          {/* Area + City */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="area"
              value={form.area}
              onChange={handleChange}
              placeholder="Area / Thana *"
              className="rounded-lg border border-border bg-bgSurface px-3 py-2 text-sm
                       focus:border-main focus:ring-2 focus:ring-mainSoft outline-none"
            />
            <input
              type="text"
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City / District *"
              className="rounded-lg border border-border bg-bgSurface px-3 py-2 text-sm
                       focus:border-main focus:ring-2 focus:ring-mainSoft outline-none"
            />
          </div>

          {/* Postcode */}
          <input
            type="text"
            name="postal_code"
            value={form.postal_code}
            onChange={handleChange}
            placeholder="Postcode *"
            className="w-full rounded-lg border border-border bg-bgSurface px-3 py-2 text-sm
                     focus:border-main focus:ring-2 focus:ring-mainSoft outline-none"
          />

          {/* Default */}
          <label className="flex items-center gap-2 text-sm text-textSecondary">
            <input
              type="checkbox"
              name="is_default"
              checked={form.is_default}
              onChange={handleChange}
              className="h-4 w-4 rounded border-border text-main focus:ring-main"
            />
            Set as default address
          </label>

          {/* Footer */}
          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm rounded-lg border border-border text-textSecondary
                       hover:bg-bgPage"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-sm rounded-lg bg-main text-textWhite
             hover:bg-mainHover active:bg-mainActive
             disabled:opacity-50"
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
