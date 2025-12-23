"use client";

import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { validateBilling } from "../utils/validation";

export default function BillingForm({
  value = {},
  errors = {},
  onChange,
  hasSavedBilling,
  onUseSaved,
  registerValidate,
}) {
  const [form, setForm] = useState({ ...value });
  const [localErrors, setLocalErrors] = useState(errors || {});

  useEffect(() => {
    onChange && onChange(form);
  }, [form]);

  useEffect(() => {
    setLocalErrors(errors || {});
  }, [errors]);

  // register validator on mount / when form changes
  useEffect(() => {
    if (typeof registerValidate === "function") {
      const unregister = registerValidate(() => {
        const errs = validateBilling(form);
        setLocalErrors(errs);
        const firstKey = Object.keys(errs)[0];
        const focusSelector = firstKey ? `[name="${firstKey}"]` : null;
        return {
          valid: Object.keys(errs).length === 0,
          errors: errs,
          focusSelector,
        };
      });
      return () => unregister && unregister();
    }
  }, [form, registerValidate]);

  const handleChange = (field) => (e) => {
    setForm((p) => ({ ...p, [field]: e.target.value }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
            <MapPin size={18} />
            Billing details
          </h2>
          <p className="text-xs md:text-sm text-textSecondary">
            Both the invoice and the delivery will be sent to this address.
          </p>
        </div>

        {hasSavedBilling && (
          <button
            type="button"
            onClick={onUseSaved}
            className="text-xs md:text-sm text-main hover:underline"
          >
            Use saved address
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* full name */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Full name *
          </label>
          <input
            name="fullName"
            type="text"
            value={form.fullName || ""}
            onChange={handleChange("fullName")}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-main/40"
            placeholder="e.g. Shahariar Emon"
          />
          {localErrors.fullName && (
            <p className="mt-1 text-xs text-red">{localErrors.fullName}</p>
          )}
        </div>

        {/* phone */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Phone number *
          </label>
          <input
            name="phone"
            type="tel"
            value={form.phone || ""}
            onChange={handleChange("phone")}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-main/40"
            placeholder="01XXXXXXXXX"
          />
          {localErrors.phone && (
            <p className="mt-1 text-xs text-red">{localErrors.phone}</p>
          )}
        </div>

        {/* email */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Email (optional)
          </label>
          <input
            name="email"
            type="email"
            value={form.email || ""}
            onChange={handleChange("email")}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-main/40"
            placeholder="you@example.com"
          />
          {localErrors.email && (
            <p className="mt-1 text-xs text-red">{localErrors.email}</p>
          )}
        </div>

        {/* area */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Area / Thana *
          </label>
          <input
            name="area"
            type="text"
            value={form.area || ""}
            onChange={handleChange("area")}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-main/40"
            placeholder="e.g. Mirpur 10"
          />
          {localErrors.area && (
            <p className="mt-1 text-xs text-red">{localErrors.area}</p>
          )}
        </div>

        {/* line1 */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Address line *
          </label>
          <input
            name="line1"
            type="text"
            value={form.line1 || ""}
            onChange={handleChange("line1")}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-main/40"
            placeholder="House, road, block, etc."
          />
          {localErrors.line1 && (
            <p className="mt-1 text-xs text-red">{localErrors.line1}</p>
          )}
        </div>

        {/* city */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            City / District *
          </label>
          <input
            name="city"
            type="text"
            value={form.city || ""}
            onChange={handleChange("city")}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-main/40"
            placeholder="e.g. Dhaka"
          />
          {localErrors.city && (
            <p className="mt-1 text-xs text-red">{localErrors.city}</p>
          )}
        </div>

        {/* postcode */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Postcode (optional)
          </label>
          <input
            name="postalCode"
            type="text"
            value={form.postalCode || form.postcode || ""}
            onChange={handleChange("postalCode")}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-main/40"
            placeholder="e.g. 1216"
          />
          {localErrors.postalCode && (
            <p className="mt-1 text-xs text-red">{localErrors.postalCode}</p>
          )}
        </div>

        {/* notes */}
        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Order notes (optional)
          </label>
          <textarea
            name="notes"
            value={form.notes || ""}
            onChange={handleChange("notes")}
            rows={3}
            className="w-full rounded-lg border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-main/40 resize-none"
            placeholder="Any special instructions for delivery…"
          />
        </div>
      </div>
    </div>
  );
}
