"use client";

import { useEffect, useState } from "react";
import { validateBilling } from "../utils/validation";
import { MapPin } from "lucide-react";

/* ---------------- helpers ---------------- */
const isSameValue = (a, b) => {
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
};

export default function BillingForm({
  value = {},
  errors = {},
  onChange,
  registerValidate,
}) {
  const [localErrors, setLocalErrors] = useState(errors || {});

  /* ---------------- local form ---------------- */
  const [form, setForm] = useState({
    fullName: value.fullName || "",
    phone: value.phone || "",
    email: value.email || "",
    area: value.area || "",
    line1: value.line1 || "",
    city: value.city || "",
    postalCode: value.postalCode || "",
    notes: value.notes || "",
  });

  /* ---------------- validation ---------------- */
  useEffect(() => {
    if (!registerValidate) return;

    registerValidate(() => {
      const vErrors = validateBilling(form);
      setLocalErrors(vErrors);
      return Object.keys(vErrors).length ? { valid: false } : { valid: true };
    });
  }, [form, registerValidate]);

  /* ---------------- sync to redux ---------------- */
  useEffect(() => {
    if (!onChange) return;

    const nextValue = {
      ...value,
      ...form,
    };

    if (!isSameValue(value, nextValue)) {
      onChange(nextValue);
    }
  }, [form]);

  /* ---------------- input change ---------------- */
  const handleChange = (field) => (e) => {
    const v = e.target.value;
    setForm((p) => ({ ...p, [field]: v }));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
          <MapPin size={18} />
          Enter delivery details
        </h2>
        <p className="text-xs md:text-sm text-textSecondary">
          Please provide your delivery address manually.
        </p>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          label="Full name *"
          placeholder="e.g. Hossen Emon"
          value={form.fullName}
          onChange={handleChange("fullName")}
          error={localErrors.fullName}
        />

        <Input
          label="Phone number *"
          placeholder="01XXXXXXXXX"
          value={form.phone}
          onChange={handleChange("phone")}
          error={localErrors.phone}
        />

        <Input
          label="Email (optional)"
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange("email")}
          error={localErrors.email}
        />

        <Input
          label="Area / Thana *"
          placeholder="e.g. Mirpur 14"
          value={form.area}
          onChange={handleChange("area")}
          error={localErrors.area}
        />

        <Input
          label="Address line *"
          placeholder="House, Road, Block, Area"
          value={form.line1}
          onChange={handleChange("line1")}
          error={localErrors.line1}
          colSpan
        />

        <Input
          label="City / District *"
          placeholder="e.g. Dhaka"
          value={form.city}
          onChange={handleChange("city")}
          error={localErrors.city}
        />

        <Input
          label="Postcode (optional)"
          placeholder="e.g. 1211"
          value={form.postalCode}
          onChange={handleChange("postalCode")}
          error={localErrors.postalCode}
        />

        {/* Notes */}
        <div className="md:col-span-2">
          <textarea
            rows={3}
            placeholder="Any special instructions for delivery…"
            value={form.notes}
            onChange={handleChange("notes")}
            className="w-full rounded-lg border px-3 py-2 text-sm"
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------- input ---------------- */
function Input({ label, value, onChange, error, placeholder, colSpan }) {
  return (
    <div className={colSpan ? "md:col-span-2" : ""}>
      <label className="block text-xs mb-1">{label}</label>

      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-lg border px-3 py-2 text-sm ${
          error ? "border-red-500" : "border-border"
        }`}
      />

      {error && <p className="text-xs text-red mt-1">{error}</p>}
    </div>
  );
}
