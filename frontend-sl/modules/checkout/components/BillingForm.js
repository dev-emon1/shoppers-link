"use client";

import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAddressesApi } from "@/modules/user/services/addressService";
import { validateBilling } from "../utils/validation";

export default function BillingForm({
  value = {},
  errors = {},
  onChange,
  hasSavedBilling,
  onUseSaved,
  registerValidate,
}) {
  const { user } = useSelector((state) => state.auth);

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [localErrors, setLocalErrors] = useState(errors || {});

  // 🔹 local controlled form (single source for inputs)
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

  // 🔹 register validation with Stepper
  useEffect(() => {
    if (!registerValidate) return;

    registerValidate(() => {
      const vErrors = validateBilling(form);
      setLocalErrors(vErrors);

      // ✅ Stepper-compatible return
      if (Object.keys(vErrors).length > 0) {
        return { valid: false };
      }

      return { valid: true };
    });
  }, [registerValidate, form]);

  // 🔹 local → redux (ONLY direction)
  useEffect(() => {
    onChange && onChange(form);
  }, [form]);

  // 🔹 sync errors from parent (redux / middleware)
  useEffect(() => {
    setLocalErrors(errors || {});
  }, [errors]);

  // 🔹 Fetch saved addresses
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.customer?.id) return;
      try {
        setLoading(true);
        const res = await getAddressesApi(user.customer.id);
        setAddresses(res?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, [user?.customer?.id]);

  // 🔹 Address select → fill form
  const handleAddressSelect = (addr) => {
    setForm((prev) => ({
      ...prev,
      line1: addr.address_line1 || "",
      city: addr.city || "",
      area: addr.area || "",
      postalCode: addr.postal_code || "",
    }));
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;

    setForm((prev) => ({ ...prev, [field]: value }));

    // 🔥 clear error for this field if valid now
    if (localErrors[field]) {
      const fieldErrors = validateBilling({
        ...form,
        [field]: value,
      });

      if (!fieldErrors[field]) {
        setLocalErrors((prev) => {
          const next = { ...prev };
          delete next[field];
          return next;
        });
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
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

        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-textSecondary">Address type:</span>
          {addresses.length > 0 ? (
            addresses.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => handleAddressSelect(a)}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-all ${
                  form.line1 === a.address_line1
                    ? "bg-main text-white border-main"
                    : "bg-white text-gray-600 border-gray-200 hover:border-main"
                }`}
              >
                {a.address_line1}
              </button>
            ))
          ) : (
            <span className="text-xs font-medium text-gray-400">
              No saved address
            </span>
          )}
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

        <div className="md:col-span-2">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Order notes (optional)
          </label>
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

/* 🔹 Reusable Input */
function Input({ label, value, onChange, error, placeholder, colSpan }) {
  return (
    <div className={colSpan ? "md:col-span-2" : ""}>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none ${
          error ? "border-red-500 focus:ring-red-200" : "border-border"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red">{error}</p>}
    </div>
  );
}
