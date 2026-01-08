"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MapPin, Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import {
  addAddressApi,
  updateAddressApi,
  deleteAddressApi,
  getAddressesApi,
} from "@/modules/user/services/address.service";

export default function AddressPage() {
  const { user } = useSelector((state) => state.auth);

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);

  // ✅ Backend + Billing aligned form
  const [form, setForm] = useState({
    addressType: "home", // home | office
    addressLine1: "",
    area: "", // thana
    city: "",
    state: "", // district
    postalCode: "",
    country: "Bangladesh",
    is_default: false,
  });

  /* =========================
        FETCH ADDRESSES
  ========================== */
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    if (!user?.customer?.id) return;

    try {
      setLoading(true);
      const res = await getAddressesApi(user.customer.id);
      setAddresses(res?.data || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
        SAVE ADDRESS
  ========================== */
  const handleSave = async () => {
    if (!user?.customer?.id) {
      toast.error("Customer profile not found");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        customer_id: user.customer.id,
        address_type: form.addressType,
        address_line1: form.addressLine1,
        area: form.area,
        city: form.city,
        state: form.state,
        postal_code: form.postalCode,
        country: form.country,
        is_default: form.is_default,
      };

      if (editAddressId) {
        await updateAddressApi(editAddressId, payload);
        toast.success("Address updated!");
      } else {
        await addAddressApi(payload);
        toast.success("Address added!");
      }

      setShowModal(false);
      fetchAddresses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  /* =========================
        DELETE ADDRESS
  ========================== */
  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;

    try {
      await deleteAddressApi(id);
      setAddresses((prev) => prev.filter((a) => a.id !== id));
      toast.success("Address deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-10 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Address Book</h1>
          <p className="text-gray-600">Manage your saved addresses</p>
        </div>

        {addresses.length < 5 && (
          <button
            onClick={() => {
              setEditAddressId(null);
              setForm({
                addressType: "home",
                addressLine1: "",
                area: "",
                city: "",
                state: "",
                postalCode: "",
                country: "Bangladesh",
                is_default: false,
              });
              setShowModal(true);
            }}
            className="bg-main text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-mainHover transition text-sm"
          >
            <Plus size={18} /> Add New
          </button>
        )}
      </div>

      {/* Address List */}
      {loading ? (
        <div className="flex justify-center">
          <Loader2 className="animate-spin text-main" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {addresses.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-2xl shadow-sm border p-6 relative"
            >
              {a.is_default && (
                <span className="absolute top-3 right-3 bg-main/10 text-main px-2 py-1 text-xs rounded">
                  Default
                </span>
              )}

              <div className="flex items-start gap-3">
                <MapPin size={24} className="text-main mt-1" />

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{a.address_line1}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {a.address_type?.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm">{a.area}</p>
                  <p className="text-gray-600 text-sm">
                    {a.city}, {a.state} - {a.postal_code}
                  </p>
                  <p className="text-gray-600 text-sm font-medium">
                    {a.country}
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => {
                      setEditAddressId(a.id);
                      setForm({
                        addressType: a.address_type || "home",
                        addressLine1: a.address_line1 || "",
                        area: a.area || "",
                        city: a.city || "",
                        state: a.state || "",
                        postalCode: a.postal_code || "",
                        country: a.country || "Bangladesh",
                        is_default: !!a.is_default,
                      });
                      setShowModal(true);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(a.id)}
                    className="p-2 hover:bg-gray-100 rounded-lg text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white w-[95%] max-w-md p-6 rounded-xl space-y-4">
            <h2 className="text-xl font-semibold">
              {editAddressId ? "Edit" : "Add"} Address
            </h2>

            {/* Address Type */}
            <div className="flex gap-3">
              {["home", "office"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, addressType: t })}
                  className={`px-3 py-1 rounded-full text-xs border ${
                    form.addressType === t
                      ? "bg-main text-white border-main"
                      : "border-gray-300"
                  }`}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>

            <InputField
              label="Address line *"
              value={form.addressLine1}
              onChange={(v) => setForm({ ...form, addressLine1: v })}
            />

            <InputField
              label="Area / Thana *"
              value={form.area}
              onChange={(v) => setForm({ ...form, area: v })}
            />

            <div className="grid grid-cols-2 gap-4">
              <InputField
                label="City *"
                value={form.city}
                onChange={(v) => setForm({ ...form, city: v })}
              />
              <InputField
                label="District *"
                value={form.state}
                onChange={(v) => setForm({ ...form, state: v })}
              />
            </div>

            <InputField
              label="Postcode"
              value={form.postalCode}
              onChange={(v) => setForm({ ...form, postalCode: v })}
            />

            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_default}
                onChange={(e) =>
                  setForm({ ...form, is_default: e.target.checked })
                }
                className="accent-main"
              />
              Set as default address
            </label>

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleSave}
                disabled={submitting}
                className="px-5 py-2 bg-main text-white rounded-lg flex items-center gap-2"
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =========================
        INPUT FIELD
========================= */
function InputField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 uppercase mb-1">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border px-3 py-2 rounded-lg outline-none focus:border-main"
      />
    </div>
  );
}
