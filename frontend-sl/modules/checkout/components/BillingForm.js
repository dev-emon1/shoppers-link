"use client";

import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { validateBilling } from "../utils/validation";
import { getAddressesApi } from "@/modules/user/services/address.service";
import { useSelector } from "react-redux";

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

  // ফর্ম স্টেট ইনিশিয়ালাইজেশন
  const [form, setForm] = useState({
    fullName: user?.customer?.full_name || "",
    phone: user?.customer?.contact_number || "",
    email: user?.email || "",
    area: "",
    line1: "",
    city: "",
    postalCode: "",
    notes: "",
    address_line1: "", // Address Type (Home/Office)
    ...value
  });

  const [localErrors, setLocalErrors] = useState(errors || {});

  // ১. অ্যাড্রেস লিস্ট ফেচ করা
  useEffect(() => {
    const fetchAddresses = async () => {
      if (!user?.customer?.id) return;
      try {
        setLoading(true);
        const res = await getAddressesApi(user.customer.id);
        setAddresses(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, [user?.customer?.id]);

  // ২. ফর্ম চেঞ্জ হ্যান্ডলার
  useEffect(() => {
    onChange && onChange(form);
  }, [form]);

  useEffect(() => {
    setLocalErrors(errors || {});
  }, [errors]);

  // ৩. অ্যাড্রেস বাটন ক্লিক করলে ফর্ম ফিল করা
  const handleAddressSelect = (addr) => {
    setForm((prev) => ({
      ...prev,
      address_line1: addr.address_line1,
      line1: addr.address_line2,
      city: addr.city,
      postalCode: addr.postal_code,
      area: addr.state,
    }));
  };

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
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs text-textSecondary">Address type:</span>
          {addresses.length > 0 ? (
            addresses.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => {
                  // ইউজার ক্লিক করলে পুরো ফর্ম ওই অ্যাড্রেস দিয়ে আপডেট হবে
                  setForm({
                    ...form,
                    address_line1: a.address_line1,
                    line1: a.address_line2, // API address_line2 -> Form line1
                    city: a.city,
                    postalCode: a.postal_code,
                    area: a.state, // API state -> Form area (যদি প্রয়োজন হয়)
                  });
                }}
                className={`px-3 py-1 text-xs font-medium rounded-full border transition-all ${form.address_line1 === a.address_line1
                  ? "bg-main text-white border-main shadow-sm"
                  : "bg-white text-gray-600 border-gray-200 hover:border-main"
                  }`}
              >
                {a.address_line1}
              </button>
            ))
          ) : (
            <span className="text-xs font-medium text-gray-400">No saved address</span>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* full name */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            Full name *
          </label>
          <input
            name="fullName"
            type="text"
            value={user?.customer?.full_name || ""}
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
            value={user?.customer?.contact_number || ""}
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
            value={user?.email || ""}
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
