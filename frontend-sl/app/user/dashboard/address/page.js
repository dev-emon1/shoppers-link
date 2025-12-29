"use client";

import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { MapPin, Pencil, Trash2, Plus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { addAddressApi, updateAddressApi, deleteAddressApi, getAddressesApi } from "@/modules/user/services/address.service";
import api from "@/core/api/axiosClient";

export default function AddressPage() {
  const { user } = useSelector((state) => state.auth);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editAddressId, setEditAddressId] = useState(null);

  const [form, setForm] = useState({
    address_line1: "",
    address_line2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "Bangladesh",
    is_default: false,
  });

  // 1. Fetch Addresses on Load
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    if (!user?.customer?.id) return; // Don't fetch if ID is missing

    try {
      setLoading(true);
      const res = await getAddressesApi(user.customer.id);
      // console.log(res.data);

      // If your axios client returns the full response:
      setAddresses(res.data);

      // If your axios client (interceptor) already returns res.data:
      // setAddresses(res.data); 

    } catch (err) {
      console.error(err);
      toast.error("Failed to load addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user?.customer?.id) return toast.error("Customer profile not found");

    setSubmitting(true);
    try {
      const payload = { ...form, customer_id: user.customer.id };

      if (editAddressId) {
        await updateAddressApi(editAddressId, payload);
        toast.success("Address updated!");
      } else {
        await addAddressApi(payload);
        toast.success("Address added!");
      }

      fetchAddresses(); // Refresh list
      setShowModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteAddressApi(id);
      setAddresses(addresses.filter(a => a.id !== id));
      toast.success("Address deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="space-y-10 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">Address Book</h1>
          <p className="text-gray-600">Manage your shipping addresses</p>
        </div>
        {addresses.length < 2 && (
          <button
            onClick={() => { setEditAddressId(null); setShowModal(true); }}
            className="bg-main text-white px-3 py-2 rounded-lg flex items-center gap-2 hover:bg-mainHover transition text-sm"
          >
            <Plus size={18} /> Add New
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center"><Loader2 className="animate-spin text-main" /></div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {addresses.map((a) => (
            <div key={a.id} className="bg-white rounded-2xl shadow-sm border p-6 relative">
              {Boolean(a.is_default) ? (
                <span className="absolute top-3 right-3 bg-main/10 text-main px-2 py-1 text-xs rounded">
                  Default
                </span>
              ) : null}
              <div className="flex items-start gap-3">
                <MapPin size={24} className="text-main mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold">{a.address_line1}</h3>
                  <p className="text-gray-600 text-sm">{a.address_line2}</p>
                  <p className="text-gray-600 text-sm">{a.city}, {a.state} - {a.postal_code}</p>
                  <p className="text-gray-600 text-sm font-medium">{a.country}</p>
                </div>
                <div className="flex gap-2 text-end mt-4">
                  <button onClick={() => { setEditAddressId(a.id); setForm(a); setShowModal(true); }} className="p-2 hover:bg-gray-100 rounded-lg"><Pencil size={18} /></button>
                  <button onClick={() => handleDelete(a.id)} className="p-2 hover:bg-gray-100 rounded-lg text-red-500"><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <div className="bg-white w-[95%] max-w-md p-6 rounded-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold">{editAddressId ? "Edit" : "Add"} Address</h2>
            <InputField label="Address Line 1" value={form.address_line1} onChange={(v) => setForm({ ...form, address_line1: v })} />
            <InputField label="Address Line 2" value={form.address_line2} onChange={(v) => setForm({ ...form, address_line2: v })} />
            <div className="grid grid-cols-2 gap-4">
              <InputField label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
              <InputField label="State" value={form.state} onChange={(v) => setForm({ ...form, state: v })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Postal Code" value={form.postal_code} onChange={(v) => setForm({ ...form, postal_code: v })} />
              <InputField label="Country" value={form.country} onChange={(v) => setForm({ ...form, country: v })} />
            </div>
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input type="checkbox" checked={form.is_default} onChange={(e) => setForm({ ...form, is_default: e.target.checked })} className="accent-main" />
              Set as default address
            </label>
            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
              <button onClick={handleSave} disabled={submitting} className="px-5 py-2 bg-main text-white rounded-lg flex items-center gap-2">
                {submitting && <Loader2 size={16} className="animate-spin" />} Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InputField({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 uppercase mb-1">{label}</label>
      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full border px-3 py-2 rounded-lg outline-none focus:border-main" />
    </div>
  );
}