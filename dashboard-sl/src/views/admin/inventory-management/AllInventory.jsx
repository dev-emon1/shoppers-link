import React, { useState, useMemo } from 'react';
import { Search, Download, Package, AlertTriangle, TrendingUp, Filter, MoreVertical, RefreshCw } from 'lucide-react';

const InventoryListPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [stockFilter, setStockFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: 'stock', direction: 'asc' });

    // Realistic inventory data - November 2025
    const inventory = [
        { id: "P28471", sku: "AAR-PAN-101", name: "Cotton Panjabi White", vendor: "Aarong", category: "Men's Wear", stock: 87, soldLast30: 312, price: 2850, cost: 1850, value: 247950, status: "Healthy" },
        { id: "P28473", sku: "KK-BEN-005", name: "Katan Benarasi Saree Red", vendor: "Kay Kraft", category: "Women's Wear", stock: 18, soldLast30: 89, price: 18500, cost: 14200, value: 333000, status: "Low Stock" },
        { id: "P28474", sku: "BATA-NAG-09", name: "Leather Nagra Sandals", vendor: "Bata Heritage", category: "Footwear", stock: 8, soldLast30: 420, price: 1990, cost: 1250, value: 15920, status: "Critical" },
        { id: "P28475", sku: "ANJ-SK-212", name: "Embroidered Salwar Kameez", vendor: "Anjan's", category: "Women's Wear", stock: 35, soldLast30: 156, price: 6750, cost: 4800, value: 236250, status: "Healthy" },
        { id: "P28472", sku: "TSK-TAN-078", name: "Tangail Block Print Sharee", vendor: "Tangail Saree Kuthir", category: "Women's Wear", stock: 42, soldLast30: 198, price: 4200, cost: 2800, value: 176400, status: "Healthy" },
        { id: "P28477", sku: "SNK-NOK-003", name: "Nokshi Katha Cushion Set", vendor: "Sylhet Nakshi", category: "Accessories", stock: 3, soldLast30: 67, price: 890, cost: 620, value: 2670, status: "Out of Stock Soon" },
        { id: "P28478", sku: "DB-WIN-112", name: "Kashmiri Winter Shawl", vendor: "Deshal", category: "Winter", stock: 56, soldLast30: 378, price: 3200, cost: 2100, value: 179200, status: "Healthy" },
        { id: "P28479", sku: "RNG-KID-045", name: "Kids Floral Frock", vendor: "Rang Bangladesh", category: "Kids", stock: 120, soldLast30: 289, price: 1450, cost: 980, value: 174000, status: "Healthy" },
    ];

    // Filtering
    const filtered = useMemo(() => {
        return inventory.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.sku.includes(searchTerm) ||
                item.vendor.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
            const matchesStock = stockFilter === 'All' ||
                (stockFilter === 'Low' && ['Low Stock', 'Critical', 'Out of Stock Soon'].includes(item.status)) ||
                (stockFilter === 'Healthy' && item.status === 'Healthy');
            return matchesSearch && matchesCategory && matchesStock;
        });
    }, [searchTerm, categoryFilter, stockFilter]);

    // Sorting
    const sorted = useMemo(() => {
        let sortable = [...filtered];
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
    }, [filtered, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const totalValue = inventory.reduce((sum, i) => sum + i.value, 0);
    const lowStockCount = inventory.filter(i => i.status !== 'Healthy').length;

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
            case 'Low Stock': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Out of Stock Soon': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            default: return 'bg-green-100 text-green-800 border-green-200';
        }
    };

    return (
        <div className="px-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Inventory Management</h1>
                    {/* <p className="text-gray-600 mt-1">Live Stock Overview • {inventory.length} SKUs</p> */}
                </div>
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 bg-main text-white px-5 py-3 rounded-lg hover:bg-mainHover font-medium shadow-lg">
                        <RefreshCw size={18} />
                        Restock Items
                    </button>
                    <button className="flex items-center gap-2 bg-main text-white px-5 py-3 rounded-lg hover:bg-mainHover font-medium shadow-lg">
                        <Download size={18} />
                        Export List
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-xl border-l-4 border-purple-500">
                    <p className="text-gray-600 text-sm">Total Inventory Value</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">৳ {(totalValue / 100000).toFixed(1)} Lac</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-xl border-l-4 border-green-500">
                    <p className="text-gray-600 text-sm">Total Units</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">{inventory.reduce((s, i) => s + i.stock, 0)}</p>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-xl border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Low/Critical Stock</p>
                            <p className="text-3xl font-bold text-red-600 mt-2">{lowStockCount}</p>
                        </div>
                        <AlertTriangle className="text-red-500" size={40} />
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-xl border-l-4 border-blue-500">
                    <p className="text-gray-600 text-sm">Fastest Moving</p>
                    <p className="text-xl font-bold text-blue-600 mt-2">Nagra Sandals (420/mo)</p>
                </div>
            </div> */}

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-4 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by product name, SKU or vendor..."
                            className="w-full pl-12 pr-6 py-2 border-2 border-gray-200 rounded-xl focus:border-main focus:outline-none text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-main" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                        <option value="All">All Categories</option>
                        <option>Men's Wear</option>
                        <option>Women's Wear</option>
                        <option>Footwear</option>
                        <option>Kids</option>
                        <option>Accessories</option>
                        <option>Winter</option>
                    </select>
                    <select className="px-2 py-2 border-2 border-gray-200 rounded-xl focus:border-main" value={stockFilter} onChange={(e) => setStockFilter(e.target.value)}>
                        <option value="All">All Stock Levels</option>
                        <option value="Healthy">Healthy Stock</option>
                        <option value="Low">Low / Critical</option>
                    </select>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-main text-white">
                            <tr>
                                <th className="py-2 px-4 text-left font-semibold cursor-pointer hover:bg-purple-700" onClick={() => requestSort('id')}>ID</th>
                                <th className="py-2 px-4 text-left font-semibold cursor-pointer hover:bg-purple-700" onClick={() => requestSort('name')}>Product</th>
                                <th className="py-2 px-4 text-left font-semibold">Vendor</th>
                                <th className="py-2 px-4 text-left font-semibold">Category</th>
                                <th className="py-2 px-4 text-left font-semibold cursor-pointer hover:bg-purple-700" onClick={() => requestSort('stock')}>Stock</th>
                                <th className="py-2 px-4 text-left font-semibold cursor-pointer hover:bg-purple-700" onClick={() => requestSort('soldLast30')}>Sold (30d)</th>
                                <th className="py-2 px-4 text-left font-semibold">Price</th>
                                <th className="py-2 px-4 text-left font-semibold">Value</th>
                                <th className="py-2 px-4 text-left font-semibold">Status</th>
                                <th className="py-2 px-4 text-center font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sorted.map((item) => (
                                <tr key={item.id} className={`hover:bg-purple-50 transition ${item.status !== 'Healthy' ? 'bg-red-50' : ''}`}>
                                    <td className="py-2 px-4 font-bold text-purple-600">#{item.id}</td>
                                    <td className="py-2 px-4">
                                        <div className="font-semibold text-gray-800">{item.name}</div>
                                        <div className="text-sm text-gray-500">SKU: {item.sku}</div>
                                    </td>
                                    <td className="py-2 px-4 text-gray-700">{item.vendor}</td>
                                    <td className="py-2 px-4 text-gray-600">{item.category}</td>
                                    <td className="py-2 px-4 text-center">
                                        <span className={`text-2xl font-bold ${item.stock < 20 ? 'text-red-600' : 'text-gray-800'}`}>
                                            {item.stock}
                                            {item.stock < 20 && <AlertTriangle className="inline ml-2 text-red-500" size={20} />}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 text-center font-semibold text-blue-600">{item.soldLast30}</td>
                                    <td className="py-2 px-4 font-medium">৳ {item.price.toLocaleString()}</td>
                                    <td className="py-2 px-4 font-bold text-green-600">৳ {item.value.toLocaleString()}</td>
                                    <td className="py-2 px-4">
                                        <span className={`px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusBadge(item.status)}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="py-2 px-4 text-center">
                                        <button className="text-purple-600 hover:text-purple-800">
                                            <MoreVertical size={20} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-5 bg-gradient-to-r from-purple-50 to-pink-50 border-t-2 border-purple-200 text-sm">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-700 font-medium">
                            Total Value: <span className="text-purple-700 font-bold">৳ {(totalValue / 100000).toFixed(1)} Lac</span> •
                            Low Stock Items: <span className="text-red-600 font-bold">{lowStockCount}</span>
                        </p>
                        <p className="text-gray-600">Last updated: November 20, 2025, 6:00 PM</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryListPage;