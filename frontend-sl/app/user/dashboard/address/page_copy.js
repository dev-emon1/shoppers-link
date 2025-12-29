"use client";

import { useState } from "react";
import { MapPin, Pencil, Trash2, Plus, Home } from "lucide-react";
import toast from "react-hot-toast";

export default function AddressPage() {
    const [addresses, setAddresses] = useState([
        {
            id: 1,
            name: "Grant Guerrero",
            phone: "01700000000",
            addressLine: "House 12, Road 5",
            city: "Dhaka",
            country: "Bangladesh",
            isDefault: true,
        },
        {
            id: 2,
            name: "Grant Guerrero",
            phone: "01700000000",
            addressLine: "Mirpur-11, Avenue 3",
            city: "Dhaka",
            country: "Bangladesh",
            isDefault: false,
        },
    ]);

    const [showModal, setShowModal] = useState(false);
    const [editAddressId, setEditAddressId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        phone: "",
        addressLine: "",
        city: "",
        country: "Bangladesh",
    });

    const openAddModal = () => {
        setEditAddressId(null);
        setForm({
            name: "",
            phone: "",
            addressLine: "",
            city: "",
            country: "Bangladesh",
        });
        setShowModal(true);
    };

    const openEditModal = (address) => {
        setEditAddressId(address.id);
        setForm(address);
        setShowModal(true);
    };

    const handleSave = () => {
        // ADD NEW
        if (!editAddressId) {
            const newAddress = {
                id: Date.now(),
                ...form,
                isDefault: false,
            };
            setAddresses([newAddress, ...addresses]);
            toast.success("Address added!");
        }

        // EDIT EXISTING
        if (editAddressId) {
            setAddresses((prev) =>
                prev.map((o) =>
                    o.id === editAddressId ? { ...form, id: editAddressId } : o
                )
            );
            toast.success("Address updated!");
        }

        setShowModal(false);
    };

    const setDefaultAddress = (id) => {
        setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })));
        toast.success("Default address updated");
    };

    const deleteAddress = (id) => {
        setAddresses((prev) => prev.filter((a) => a.id !== id));
        toast.success("Address removed");
    };

    return (
        <div className="space-y-10">
            {/* PAGE TITLE */}
            <div>
                <h1 className="text-2xl font-semibold">Address Book</h1>
                <p className="text-gray-600">Manage your shipping addresses</p>
            </div>

            {/* ADD BUTTON */}
            <button
                onClick={openAddModal}
                className="bg-main text-white px-5 py-3 rounded-lg flex items-center gap-2 hover:bg-mainHover transition"
            >
                <Plus size={18} /> Add New Address
            </button>

            {/* ADDRESS LIST */}
            <div className="grid md:grid-cols-2 gap-6">
                {addresses.map((a) => (
                    <div
                        key={a.id}
                        className="bg-white rounded-2xl shadow-sm border p-6 relative"
                    >
                        {a.isDefault && (
                            <span className="absolute top-3 right-3 bg-main/10 text-main px-2 py-1 text-xs rounded">
                                Default
                            </span>
                        )}

                        <div className="flex items-start gap-3">
                            <MapPin size={24} className="text-main mt-1" />

                            <div className="flex-1 space-y-1">
                                <h3 className="font-semibold">{a.name}</h3>
                                <p className="text-gray-600 text-sm">{a.phone}</p>
                                <p className="text-gray-600 text-sm">{a.addressLine}</p>
                                <p className="text-gray-600 text-sm">
                                    {a.city}, {a.country}
                                </p>
                            </div>

                            {/* ACTIONS */}
                            <div className="flex flex-col items-end gap-2">
                                <button
                                    onClick={() => openEditModal(a)}
                                    className="p-2 hover:bg-gray-100 rounded-lg"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={() => deleteAddress(a.id)}
                                    className="p-2 hover:bg-gray-100 rounded-lg text-red-500"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        {/* SET DEFAULT BTN */}
                        {!a.isDefault && (
                            <button
                                onClick={() => setDefaultAddress(a.id)}
                                className="mt-4 w-full text-main border border-main rounded-lg py-2 hover:bg-main hover:text-white transition"
                            >
                                Set as Default
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {/* ADD / EDIT MODAL */}
            {showModal && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
                    <div className="bg-white w-[95%] max-w-md p-6 rounded-xl shadow-xl space-y-6">
                        <h2 className="text-xl font-semibold">
                            {editAddressId ? "Edit Address" : "Add New Address"}
                        </h2>

                        {/* FORM */}
                        <div className="space-y-4">
                            <InputField
                                label="Full Name"
                                value={form.name}
                                onChange={(v) => setForm({ ...form, name: v })}
                            />
                            <InputField
                                label="Phone"
                                value={form.phone}
                                onChange={(v) => setForm({ ...form, phone: v })}
                            />
                            <InputField
                                label="Address Line"
                                value={form.addressLine}
                                onChange={(v) => setForm({ ...form, addressLine: v })}
                            />
                            <InputField
                                label="City"
                                value={form.city}
                                onChange={(v) => setForm({ ...form, city: v })}
                            />
                            <InputField
                                label="Country"
                                value={form.country}
                                onChange={(v) => setForm({ ...form, country: v })}
                            />
                        </div>

                        {/* ACTION BUTTONS */}
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 rounded-lg border"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-5 py-2 bg-main text-white rounded-lg hover:bg-mainHover"
                            >
                                {editAddressId ? "Save Changes" : "Add Address"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

/* Input Component */
function InputField({ label, value, onChange }) {
    return (
        <div>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg outline-none focus:ring-main focus:border-main"
            />
        </div>
    );
}
