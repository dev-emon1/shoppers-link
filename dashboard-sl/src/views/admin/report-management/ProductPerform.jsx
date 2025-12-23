import React, { useState, useMemo } from 'react';
import { Search, Download, TrendingUp, TrendingDown, Star, Package, Filter, AlertCircle } from 'lucide-react';

const ProductPerformancePage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: 'revenue', direction: 'desc' });

    // Top + Regular Products - November 1–19, 2025
    const products = [
        { rank: 1, id: "P28473", name: "Katan Benarasi Saree - Red/Gold", vendor: "Kay Kraft", category: "Women's Wear", unitsSold: 892, revenue: 16522000, profit: 8261000, stock: 18, returnRate: 4.2, rating: 4.9, velocity: 47 },
        { rank: 2, id: "P28471", name: "Premium Cotton Panjabi - White", vendor: "Aarong", category: "Men's Wear", unitsSold: 1245, revenue: 3548250, profit: 2128950, stock: 87, returnRate: 1.8, rating: 4.8, velocity: 65 },
        { rank: 3, id: "P28475", name: "Hand-Embroidered Salwar Kameez", vendor: "Anjan's", category: "Women's Wear", unitsSold: 982, revenue: 6628500, profit: 3314250, stock: 35, returnRate: 6.1, rating: 4.7, velocity: 52 },
        { rank: 4, id: "P28474", name: "Leather Nagra Sandals (40-44)", vendor: "Bata Heritage", category: "Footwear", unitsSold: 2156, revenue: 4290440, profit: 1716176, stock: 8, returnRate: 8.9, rating: 4.5, velocity: 113 },
        { rank: 5, id: "P28472", name: "Tangail Block Print Sharee", vendor: "Tangail Saree Kuthir", category: "Women's Wear", unitsSold: 1789, revenue: 7513800, profit: 4508280, stock: 42, returnRate: 3.5, rating: 4.9, velocity: 94 },
        { rank: 6, id: "P28478", name: "Kashmiri Winter Shawl", vendor: "Deshal", category: "Winter", unitsSold: 1456, revenue: 4659200, profit: 2795520, stock: 56, returnRate: 2.9, rating: 4.8, velocity: 76 },
        { rank: 7, id: "P28476", name: "Kids Floral Frock (5-10 yrs)", vendor: "Rang Bangladesh", category: "Kids", unitsSold: 823, revenue: 1193350, profit: 596675, stock: 120, returnRate: 5.4, rating: 4.6, velocity: 43 },
        { rank: 8, id: "P28477", name: "Nokshi Katha Cushion Set", vendor: "Sylhet Nakshi", category: "Accessories", unitsSold: 312, revenue: 277680, profit: 138840, stock: 3, returnRate: 12.8, rating: 4.3, velocity: 16 },
    ];

    // Filtering & Sorting
    const filtered = useMemo(() => {
        return products.filter(p => {
            const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.id.includes(searchTerm) ||
                p.vendor.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
            return matchesSearch && matchesCat;
        });
    }, [searchTerm, categoryFilter]);

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

    const formatCurrency = (amount) => `৳ ${(amount / 100000).toFixed(1)}L`;

    return (
        <div className="px-6 bg-gray-50 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Product Performance Report</h1>
                    <p className="text-gray-600">November 1 – 19, 2025 • All Products Ranking</p>
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
                    <p className="text-sm text-gray-600">Total Revenue (Nov)</p>
                    <p className="text-2xl font-bold text-main">৳ 49.82 Cr</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow border-l-4 border-main">
                    <p className="text-sm text-gray-600">Units Sold</p>
                    <p className="text-2xl font-bold text-main">10,555</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow border-l-4 border-orange-500">
                    <p className="text-sm text-gray-600">Avg. Return Rate</p>
                    <p className="text-2xl font-bold text-orange-600">5.7%</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow border-l-4 border-main">
                    <p className="text-sm text-gray-600">Top 5 Contribution</p>
                    <p className="text-2xl font-bold text-main">68%</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-5 mb-6 flex flex-col md:flex-row gap-4 text-sm">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search product name, ID or vendor..."
                            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <select
                    className="px-4 py-3 border rounded-lg"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="All">All Categories</option>
                    <option>Women's Wear</option>
                    <option>Men's Wear</option>
                    <option>Footwear</option>
                    <option>Kids</option>
                    <option>Accessories</option>
                    <option>Winter</option>
                </select>
            </div>

            {/* Product Performance Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('rank')}>Rank</th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('name')}>Product</th>
                                <th className="py-4 px-6 text-left">Vendor</th>
                                <th className="py-4 px-6 text-left">Category</th>
                                <th className="py-4 px-6 text-center cursor-pointer hover:bg-gray-100" onClick={() => requestSort('unitsSold')}>Units Sold</th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('revenue')}>Revenue</th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('profit')}>Profit</th>
                                <th className="py-4 px-6 text-center cursor-pointer hover:bg-gray-100" onClick={() => requestSort('velocity')}>Velocity/day</th>
                                <th className="py-4 px-6 text-center">Stock</th>
                                <th className="py-4 px-6 text-center cursor-pointer hover:bg-gray-100" onClick={() => requestSort('returnRate')}>Return %</th>
                                <th className="py-4 px-6 text-center cursor-pointer hover:bg-gray-100" onClick={() => requestSort('rating')}>Rating</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sorted.map((p) => (
                                <tr key={p.id} className={`hover:bg-gray-50 transition ${p.stock < 20 ? 'bg-red-50' : ''}`}>
                                    <td className="py-2 px-2">
                                        <span className={`text-2xl font-bold ${p.rank <= 3 ? 'text-main' : 'text-gray-400'}`}>
                                            #{p.rank}
                                        </span>
                                    </td>
                                    <td className="py-2 px-2">
                                        <div className="font-medium">{p.name}</div>
                                        <div className="text-xs text-gray-500">ID: {p.id}</div>
                                    </td>
                                    <td className="py-2 px-2 text-gray-700">{p.vendor}</td>
                                    <td className="py-2 px-2 text-gray-600">{p.category}</td>
                                    <td className="py-2 px-2 text-center font-bold text-main">{p.unitsSold.toLocaleString()}</td>
                                    <td className="py-2 px-2 font-bold text-main">{formatCurrency(p.revenue)}</td>
                                    <td className="py-2 px-2 font-bold text-indigo-600">{formatCurrency(p.profit)}</td>
                                    <td className="py-2 px-2 text-center font-semibold text-main">{p.velocity}</td>
                                    <td className="py-2 px-2 text-center">
                                        <span className={`font-bold ${p.stock < 20 ? 'text-main' : 'text-gray-800'}`}>
                                            {p.stock} {p.stock < 20 && <AlertCircle className="inline ml-1" size={16} />}
                                        </span>
                                    </td>
                                    <td className="py-2 px-2 text-center">
                                        <span className={`font-medium ${p.returnRate > 7 ? 'text-main' : 'text-gray-700'}`}>
                                            {p.returnRate}%
                                        </span>
                                    </td>
                                    <td className="py-2 px-2 text-center">
                                        <div className="flex items-center justify-center gap-1">
                                            <Star className="text-main fill-current" size={16} />
                                            {p.rating}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t text-sm text-gray-600">
                    Showing {sorted.length} products •
                    Total Revenue from these products: ৳ 49.82 Cr •
                    Avg Return Rate: 5.7% •
                    {products.filter(p => p.stock < 20).length > 0 && (
                        <span className="text-main font-medium ml-4">
                            ⚠ {products.filter(p => p.stock < 20).length} products low in stock
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductPerformancePage;