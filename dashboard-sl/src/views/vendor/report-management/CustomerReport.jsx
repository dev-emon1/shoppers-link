import React, { useState, useMemo } from 'react';
import { Search, Download, User, ShoppingBag, Calendar, TrendingUp, Filter } from 'lucide-react';

const CustomerPerformancePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [segmentFilter, setSegmentFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: 'ltv', direction: 'desc' });

    // Realistic Top + Regular Customers - As of November 19, 2025
    const customers = [
        { rank: 1, id: "#C9817", name: "Nusrat Jahan", phone: "01655-678901", city: "Dhaka", joinDate: "2023-08-12", totalOrders: 28, totalSpent: 485000, ltv: 485000, aov: 17321, lastPurchase: "2025-11-18", segment: "VIP", growth: "+68%" },
        { rank: 2, id: "#C9300", name: "Sumaiya Islam", phone: "01712-345678", city: "Dhaka", joinDate: "2023-06-20", totalOrders: 42, totalSpent: 728000, ltv: 728000, aov: 17333, lastPurchase: "2025-11-17", segment: "VIP", growth: "+92%" },
        { rank: 3, id: "#C9821", name: "Fatema Akter", phone: "01711-234567", city: "Dhaka", joinDate: "2024-01-15", totalOrders: 18, totalSpent: 312500, ltv: 312500, aov: 17361, lastPurchase: "2025-11-19", segment: "Loyal", growth: "+45%" },
        { rank: 4, id: "#C9819", name: "Ayesha Siddika", phone: "01833-456789", city: "Sylhet", joinDate: "2024-03-22", totalOrders: 15, totalSpent: 268000, ltv: 268000, aov: 17867, lastPurchase: "2025-11-18", segment: "Loyal", growth: "+38%" },
        { rank: 5, id: "#C9818", name: "Md. Salman Khan", phone: "01544-567890", city: "Dhaka", joinDate: "2024-05-10", totalOrders: 22, totalSpent: 398000, ltv: 398000, aov: 18091, lastPurchase: "2025-11-16", segment: "VIP", growth: "+78%" },
        { rank: 6, id: "#C9820", name: "Rahim Karim", phone: "01922-345678", city: "Chattogram", joinDate: "2025-09-01", totalOrders: 3, totalSpent: 48500, ltv: 48500, aov: 16167, lastPurchase: "2025-11-19", segment: "New", growth: "N/A" },
        { rank: 7, id: "#C9815", name: "Tanjila Rahman", phone: "01977-890123", city: "Khulna", joinDate: "2024-07-18", totalOrders: 8, totalSpent: 128000, ltv: 128000, aov: 16000, lastPurchase: "2025-10-22", segment: "Churn Risk", growth: "-12%" },
        { rank: 8, id: "#C9305", name: "Arif Hossain", phone: "01766-789012", city: "Rajshahi", joinDate: "2023-11-30", totalOrders: 19, totalSpent: 298000, ltv: 298000, aov: 15684, lastPurchase: "2025-11-12", segment: "Loyal", growth: "+22%" },
    ];

    // Filtering & Sorting
    const filtered = useMemo(() => {
        return customers.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                c.phone.includes(searchTerm) ||
                c.id.includes(searchTerm);
            const matchesSegment = segmentFilter === 'All' || c.segment === segmentFilter;
            return matchesSearch && matchesSegment;
        });
    }, [searchTerm, segmentFilter]);

    const sorted = useMemo(() => {
        let sortable = [...filtered];
        if (sortConfig.key) {
            sortable.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortable;
    }, [filtered, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const formatCurrency = (amount) => `৳ ${(amount / 1000).toFixed(0)}K`;

    return (
        <div className="px-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Customer Performance Report</h1>
                    <p className="text-gray-600">Lifetime Value, Segments & Behavior • As of November 19, 2025</p>
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

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-2">
                <div className="bg-white p-5 rounded-lg shadow border-l-4 border-main">
                    <p className="text-sm text-gray-600">Total Customers</p>
                    <p className="text-2xl font-bold text-main">12,847</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow border-l-4 border-main">
                    <p className="text-sm text-gray-600">Total Customer LTV</p>
                    <p className="text-2xl font-bold text-main">৳ 62.4 Cr</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow border-l-4 border-main">
                    <p className="text-sm text-gray-600">Avg. Order Value</p>
                    <p className="text-2xl font-bold text-main">৳ 17,280</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow border-l-4 border-orange-500">
                    <p className="text-sm text-gray-600">Repeat Rate</p>
                    <p className="text-2xl font-bold text-orange-600">62%</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-5 mb-6 flex flex-col md:flex-row gap-4 text-sm">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by name, phone or customer ID..."
                            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-main"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <select
                    className="px-4 py-3 border rounded-lg"
                    value={segmentFilter}
                    onChange={(e) => setSegmentFilter(e.target.value)}
                >
                    <option value="All">All Segments</option>
                    <option>VIP</option>
                    <option>Loyal</option>
                    <option>New</option>
                    <option>Churn Risk</option>
                </select>
            </div>

            {/* Customer Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('rank')}>Rank</th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('name')}>Customer</th>
                                <th className="py-4 px-6 text-left">City</th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('joinDate')}>Joined</th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('totalOrders')}>Orders</th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('ltv')}>Lifetime Value</th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('aov')}>AOV</th>
                                <th className="py-4 px-6 text-left">Last Purchase</th>
                                <th className="py-4 px-6 text-left">Segment</th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('growth')}>Growth YoY</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sorted.map((c) => (
                                <tr key={c.id} className="hover:bg-gray-50 transition">
                                    <td className="py-2 px-2">
                                        <span className={`text-2xl font-bold ${c.rank <= 3 ? 'text-main' : 'text-gray-400'}`}>
                                            #{c.rank}
                                        </span>
                                    </td>
                                    <td className="py-2 px-2">
                                        <div className="font-medium">{c.name}</div>
                                        <div className="text-xs text-gray-500">{c.id} • {c.phone}</div>
                                    </td>
                                    <td className="py-2 px-2 text-gray-700">{c.city}</td>
                                    <td className="py-2 px-2 text-gray-600">{c.joinDate}</td>
                                    <td className="py-2 px-2 text-center font-bold text-main">{c.totalOrders}</td>
                                    <td className="py-2 px-2 font-bold text-main">{formatCurrency(c.ltv)}</td>
                                    <td className="py-2 px-2 font-semibold text-secondary">৳ {c.aov.toLocaleString()}</td>
                                    <td className="py-2 px-2 text-gray-700">{c.lastPurchase}</td>
                                    <td className="py-2 px-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium
                      ${c.segment === 'VIP' ? 'bg-purple-100 text-purple-800' :
                                                c.segment === 'Loyal' ? 'bg-blue-100 text-blue-800' :
                                                    c.segment === 'New' ? 'bg-green-100 text-green-800' :
                                                        'bg-red-100 text-red-800'}`}>
                                            {c.segment}
                                        </span>
                                    </td>
                                    <td className="py-2 px-2">
                                        <span className={`font-medium ${c.growth.startsWith('+') ? 'text-main' : 'text-main'}`}>
                                            {c.growth}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t text-sm text-gray-600">
                    Total Active Customers: 12,847 •
                    VIP Customers (Top 5%): 642 •
                    Churn Risk Customers: 1,128 •
                    Avg Customer Lifetime Value: ৳ 48,560
                </div>
            </div>
        </div>
    );
};

export default CustomerPerformancePage;