import React, { useState, useMemo } from 'react';
import { Search, Download, TrendingUp, TrendingDown, Star, Package, DollarSign, Filter } from 'lucide-react';

const VendorPerformancePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: 'totalSales', direction: 'desc' });

    // Realistic Vendor Performance Data - November 2025 (up to Nov 19)
    const vendorData = [
        { id: 101, name: "Aarong Official", owner: "BRAC", location: "Dhaka", products: 342, orders: 1245, totalSales: 142800000, commission: 14.28e6, rating: 4.9, growth: 38.2, status: "Active", payout: "Paid" },
        { id: 102, name: "Kay Kraft Dhaka", owner: "Khaled Mahmud", location: "Dhaka", products: 268, orders: 892, totalSales: 116400000, commission: 11.64e6, rating: 4.8, growth: 29.7, status: "Active", payout: "Paid" },
        { id: 103, name: "Tangail Saree Kuthir", owner: "Abdul Malek", location: "Tangail", products: 156, orders: 789, totalSales: 89200000, commission: 8.92e6, rating: 4.7, growth: 42.1, status: "Active", payout: "Pending" },
        { id: 104, name: "Anjan's Boutique", owner: "Farhana Anjan", location: "Dhaka", products: 412, orders: 982, totalSales: 132500000, commission: 13.25e6, rating: 4.9, growth: 51.3, status: "Active", payout: "Paid" },
        { id: 105, name: "Rang Bangladesh", owner: "Bipasha Hayat", location: "Dhaka", products: 189, orders: 567, totalSales: 78500000, commission: 7.85e6, rating: 4.6, growth: 22.4, status: "Active", payout: "Paid" },
        { id: 106, name: "Nipun Tailors", owner: "Nipun Ahmed", location: "Chattogram", products: 98, orders: 234, totalSales: 34500000, commission: 3.45e6, rating: 4.3, growth: -8.2, status: "Active", payout: "Pending" },
        { id: 107, name: "Sylhet Nakshi House", owner: "Rehana Begum", location: "Sylhet", products: 67, orders: 412, totalSales: 62800000, commission: 6.28e6, rating: 4.8, growth: 67.9, status: "Active", payout: "Paid" },
        { id: 108, name: "Deshal by Bibiana", owner: "Shaheen Ahmed", location: "Dhaka", products: 134, orders: 378, totalSales: 56700000, commission: 5.67e6, rating: 4.5, growth: 18.9, status: "Active", payout: "Pending" },
    ];

    // Filtering & Sorting
    const filteredVendors = useMemo(() => {
        return vendorData.filter(v => {
            const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                v.location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'All' || v.payout === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, statusFilter]);

    const sortedVendors = useMemo(() => {
        let sortable = [...filteredVendors];
        if (sortConfig.key) {
            sortable.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortable;
    }, [filteredVendors, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const formatCurrency = (amount) => `৳ ${(amount / 100000).toFixed(1)}L`;

    return (
        <div className="px-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Partner Performance Report</h1>
                    {/* <p className="text-gray-600">November 2025 (1 – 19 Nov) • Multi-Vendor Marketplace</p> */}
                </div>
                <div className='flex gap-3'>
                    <button className="flex items-center gap-2 bg-main text-white px-2 py-2 rounded-lg hover:bg-mainHover transition text-sm">
                        <Download size={16} />
                        Export CSV
                    </button>
                    <button className="flex items-center gap-2 bg-main text-white px-2 py-2 rounded-lg hover:bg-mainHover transition text-sm">
                        <Download size={16} />
                        Export PDF
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-5 mb-6 flex flex-col md:flex-row gap-4 text-sm">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search vendor, owner or location..."
                            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-main"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <select
                    className="px-4 py-3 border rounded-lg"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="All">All Payout Status</option>
                    <option>Paid</option>
                    <option>Pending</option>
                </select>
            </div>

            {/* Performance Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('id')}>ID</th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('name')}>Vendor Name</th>
                                <th className="py-4 px-6 text-left">Owner</th>
                                <th className="py-4 px-6 text-left">Location</th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('products')}>Products</th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('orders')}>Orders</th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('totalSales')}>Total Sales</th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('commission')}>Commission (10%)</th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('rating')}>Rating</th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('growth')}>Growth (MoM)</th>
                                <th className="py-4 px-6 text-left">Payout Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sortedVendors.map((v) => (
                                <tr key={v.id} className="hover:bg-gray-50 transition">
                                    <td className="py-2 px-2 font-bold text-main">#{v.id}</td>
                                    <td className="py-2 px-2 font-medium text-secondary">{v.name}</td>
                                    <td className="py-2 px-2 text-gray-700">{v.owner}</td>
                                    <td className="py-2 px-2 text-gray-600">{v.location}</td>
                                    <td className="py-2 px-2 text-center font-semibold">{v.products}</td>
                                    <td className="py-2 px-2 text-center font-semibold text-main">{v.orders}</td>
                                    <td className="py-2 px-2 font-bold text-green-600">{formatCurrency(v.totalSales)}</td>
                                    <td className="py-2 px-2 font-bold text-secondary">{formatCurrency(v.commission)}</td>
                                    <td className="py-2 px-2">
                                        <div className="flex items-center gap-1">
                                            <Star className="text-main fill-current" size={16} />
                                            <span className="font-medium">{v.rating}</span>
                                        </div>
                                    </td>
                                    <td className="py-2 px-2">
                                        <span className={`flex items-center gap-1 font-bold ${v.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {v.growth > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                            {v.growth > 0 ? '+' : ''}{v.growth}%
                                        </span>
                                    </td>
                                    <td className="py-2 px-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${v.payout === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {v.payout}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t text-sm text-gray-600">
                    Total Vendors: {vendorData.length} •
                    Total Sales via Vendors: ৳ 72.05 Cr •
                    Total Commission Earned: ৳ 7.205 Cr (10%)
                </div>
            </div>
        </div>
    );
};

export default VendorPerformancePage;