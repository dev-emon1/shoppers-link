import React, { useState, useMemo } from 'react';
import { Search, Download, MapPin, Truck, Edit2, Save, X, Plus, Filter } from 'lucide-react';

const ShippingZonesPage = () => {
    const [zones, setZones] = useState([
        {
            id: 1,
            zoneName: "Inside Dhaka Metro",
            areas: "Dhaka City, Mirpur, Uttara, Gulshan, Banani, Dhanmondi, etc.",
            courier: "Pathao Delivery",
            baseRate: 80,
            perKgExtra: 20,
            codCharge: "1% (min ৳20)",
            deliveryTime: "Same Day / Next Day",
            status: "Active",
            weightTiers: "Up to 1kg: ৳80 | 1-3kg: +৳32 | 3-5kg: +৳60"
        },
        {
            id: 2,
            zoneName: "Outside Dhaka (District HQs)",
            areas: "Chattogram, Sylhet, Khulna, Rajshahi, Barisal, Cumilla, etc.",
            courier: "RedX / Pathao",
            baseRate: 130,
            perKgExtra: 30,
            codCharge: "1% (min ৳15)",
            deliveryTime: "1-3 Days",
            status: "Active",
            weightTiers: "Up to 1kg: ৳130 | 1-3kg: +৳60 | 3-5kg: +৳90"
        },
        {
            id: 3,
            zoneName: "Remote / Upazila Areas",
            areas: "All Upazilas, Haors, Islands, Hill Tracts",
            courier: "Sundarban / SA Paribahan",
            baseRate: 180,
            perKgExtra: 50,
            codCharge: "Free (We bear)",
            deliveryTime: "3-7 Days",
            status: "Active",
            weightTiers: "Up to 1kg: ৳180 | 1-3kg: +৳100 | 3-5kg: +৳150"
        },
        {
            id: 4,
            zoneName: "Premium Express (Same Day)",
            areas: "Selected Dhaka Areas Only",
            courier: "Pathao Premium",
            baseRate: 150,
            perKgExtra: 32,
            codCharge: "1.5%",
            deliveryTime: "Same Day (before 8 PM)",
            status: "Active",
            weightTiers: "Up to 1kg: ৳150 | Every extra kg: +৳32"
        },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({});

    const handleEdit = (zone) => {
        setEditingId(zone.id);
        setEditData({ ...zone });
    };

    const saveEdit = () => {
        setZones(prev => prev.map(z => z.id === editingId ? { ...editData } : z));
        setEditingId(null);
        setEditData({});
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditData({});
    };

    const filtered = useMemo(() => {
        return zones.filter(z =>
            z.zoneName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            z.courier.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <div className="px-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Shipping Zones & Rates</h1>
                    <p className="text-gray-600 mt-2">Manage delivery zones, couriers & pricing across Bangladesh</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-2">
                <div className="bg-main p-4 rounded-2xl shadow-xl text-white">
                    <MapPin size={32} className="mb-3" />
                    <p className="text-lg opacity-90">Total Zones</p>
                    <p className="text-2xl font-bold">{zones.length}</p>
                </div>
                <div className="bg-main p-4 rounded-2xl shadow-xl text-white">
                    <Truck size={32} className="mb-3" />
                    <p className="text-lg opacity-90">Active Couriers</p>
                    <p className="text-2xl font-bold">4</p>
                </div>
                <div className="bg-main p-4 rounded-2xl shadow-xl text-white">
                    <p className="text-lg opacity-90">Cheapest Rate</p>
                    <p className="text-2xl font-bold">৳80</p>
                    <p className="text-sm opacity-90">Inside Dhaka</p>
                </div>
                <div className="bg-main to-red-500 p-4 rounded-2xl shadow-xl text-white">
                    <p className="text-lg opacity-90">Remote Delivery</p>
                    <p className="text-2xl font-bold">৳180+</p>
                    <p className="text-sm opacity-90">Upazila & Islands</p>
                </div>
            </div>

            {/* Zones Table */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filtered.map((zone) => (
                    <div key={zone.id} className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
                        {/* Header */}
                        <div className="bg-secondary text-white p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold flex items-center gap-2">
                                        <MapPin size={28} />
                                        {zone.zoneName}
                                    </h3>
                                    <p className="text-purple-100 mt-1 px-8">Courier: {zone.courier}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${zone.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}>
                                        {zone.status}
                                    </span>
                                    {editingId === zone.id ? (
                                        <>
                                            <button onClick={saveEdit} className="text-white hover:bg-green-600 p-2 rounded-lg transition">
                                                <Save size={20} />
                                            </button>
                                            <button onClick={cancelEdit} className="text-white hover:bg-red-600 p-2 rounded-lg transition">
                                                <X size={20} />
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={() => handleEdit(zone)} className="text-white hover:bg-white/20 p-2 rounded-lg transition">
                                            <Edit2 size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Body */}
                        <div className="p-4 space-y-6">
                            <div>
                                <p className="text-gray-600 font-medium">Covered Areas</p>
                                <p className="text-gray-800 mt-1">{zone.areas}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-gray-600 font-medium">Base Rate (up to 1kg)</p>
                                    <p className="text-3xl font-bold text-purple-600 mt-1">৳ {zone.baseRate}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 font-medium">Per Kg Extra</p>
                                    <p className="text-2xl font-bold text-blue-600 mt-1">৳ {zone.perKgExtra}</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-6 border-2 border-dashed border-gray-300">
                                <p className="text-gray-600 font-medium mb-3">Weight-Based Pricing</p>
                                <p className="text-gray-800 font-mono text-sm leading-relaxed">{zone.weightTiers}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <p className="text-gray-600 font-medium">COD Charge</p>
                                    <p className="text-lg font-bold text-green-600 mt-1">{zone.codCharge}</p>
                                </div>
                                <div>
                                    <p className="text-gray-600 font-medium">Delivery Time</p>
                                    <p className="text-lg font-bold text-orange-600 mt-1">{zone.deliveryTime}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 text-center text-gray-600">
                <p className="text-sm">
                    Last updated: November 20, 2025 • Full coverage across all 64 districts & 495 upazilas of Bangladesh
                </p>
            </div>
        </div>
    );
};

export default ShippingZonesPage;