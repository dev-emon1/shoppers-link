import React, { useState, useMemo } from 'react';
import { Search, Download, Package, AlertTriangle, TrendingUp, Filter, MoreVertical, RefreshCw, ChevronUp, ChevronDown, Edit2, Save, X } from 'lucide-react';

const InventoryManagementPage = () => {
    const [inventory, setInventory] = useState([
        { id: "P28471", sku: "AAR-PAN-101", name: "Cotton Panjabi White", vendor: "Aarong", category: "Men's Wear", currentStock: 87, minStock: 50, soldLast30: 312, price: 2850, costPrice: 1850, totalValue: 247950, status: "Healthy" },
        { id: "P28473", sku: "KK-BEN-005", name: "Katan Benarasi Saree Red", vendor: "Kay Kraft", category: "Women's Wear", currentStock: 18, minStock: 30, soldLast30: 89, price: 18500, costPrice: 14200, totalValue: 333000, status: "Low Stock" },
        { id: "P28474", sku: "BATA-NAG-09", name: "Leather Nagra Sandals", vendor: "Bata Heritage", category: "Footwear", currentStock: 8, minStock: 100, soldLast30: 420, price: 1990, costPrice: 1250, totalValue: 15920, status: "Critical" },
        { id: "P28475", sku: "ANJ-SK-212", name: "Embroidered Salwar Kameez", vendor: "Anjan's", category: "Women's Wear", currentStock: 35, minStock: 40, soldLast30: 156, price: 6750, costPrice: 4800, totalValue: 236250, status: "Low Stock" },
        { id: "P28472", sku: "TSK-TAN-078", name: "Tangail Block Print Sharee", vendor: "Tangail Saree Kuthir", category: "Women's Wear", currentStock: 42, minStock: 50, soldLast30: 198, price: 4200, costPrice: 2800, totalValue: 176400, status: "Healthy" },
        { id: "P28477", sku: "SNK-NOK-003", name: "Nokshi Katha Cushion Set", vendor: "Sylhet Nakshi", category: "Accessories", currentStock: 3, minStock: 20, soldLast30: 67, price: 890, costPrice: 620, totalValue: 2670, status: "Out of Stock Soon" },
        { id: "P28478", sku: "DB-WIN-112", name: "Kashmiri Winter Shawl", vendor: "Deshal", category: "Winter Wear", currentStock: 56, minStock: 60, soldLast30: 378, price: 3200, costPrice: 2100, totalValue: 179200, status: "Healthy" },
        { id: "P28479", sku: "RNG-KID-045", name: "Kids Floral Frock", vendor: "Rang Bangladesh", category: "Kids Wear", currentStock: 120, minStock: 80, soldLast30: 289, price: 1450, costPrice: 980, totalValue: 174000, status: "Healthy" },
    ]);

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [stockStatusFilter, setStockStatusFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: 'currentStock', direction: 'asc' });
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');

    // Update stock logic
    const handleEditStock = (id, currentStock) => {
        setEditingId(id);
        setEditValue(currentStock);
    };

    const saveStock = (id) => {
        setInventory(prev => prev.map(item =>
            item.id === id
                ? {
                    ...item,
                    currentStock: parseInt(editValue) || 0,
                    totalValue: (parseInt(editValue) || 0) * item.price,
                    status: getStockStatus(parseInt(editValue) || 0, item.minStock)
                }
                : item
        ));
        setEditingId(null);
        setEditValue('');
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditValue('');
    };

    const getStockStatus = (stock, minStock) => {
        if (stock === 0) return "Out of Stock";
        if (stock < minStock * 0.3) return "Critical";
        if (stock < minStock) return "Low Stock";
        if (stock < minStock * 1.5) return "Out of Stock Soon";
        return "Healthy";
    };

    // Filters + Sorting (same as before)
    const filtered = useMemo(() => {
        return inventory.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.sku.includes(searchTerm) ||
                item.vendor.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
            const matchesStatus = stockStatusFilter === 'All' ||
                (stockStatusFilter === 'Low/Critical' && ['Low Stock', 'Critical', 'Out of Stock Soon', 'Out of Stock'].includes(item.status)) ||
                (stockStatusFilter === 'Healthy' && item.status === 'Healthy');
            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [inventory, searchTerm, categoryFilter, stockStatusFilter]);

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

    const totalValue = inventory.reduce((sum, i) => sum + i.totalValue, 0);
    const lowStockCount = inventory.filter(i => !['Healthy'].includes(i.status)).length;

    const getStatusBadge = (status) => {
        const colors = {
            'Critical': 'bg-red-100 text-red-800 border-red-300',
            'Low Stock': 'bg-orange-100 text-orange-800 border-orange-300',
            'Out of Stock Soon': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'Out of Stock': 'bg-gray-100 text-gray-800 border-gray-300',
            'Healthy': 'bg-green-100 text-green-800 border-green-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="px-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-2">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Restock Product</h1>
                    <p className="text-gray-600 mt-2">Live Stock • Edit Stock • Restock Alerts</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-4 mb-2">
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-4 text-gray-400" size={22} />
                        <input
                            type="text"
                            placeholder="Search by product name, SKU or vendor..."
                            className="w-full pl-12 pr-6 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none text-lg"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select className="px-6 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 text-lg" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                        <option value="All">All Categories</option>
                        <option>Men's Wear</option>
                        <option>Women's Wear</option>
                        <option>Footwear</option>
                        <option>Kids Wear</option>
                        <option>Accessories</option>
                        <option>Winter Wear</option>
                    </select>
                    <select className="px-6 py-2 border-2 border-gray-200 rounded-xl focus:border-purple-500 text-lg" value={stockStatusFilter} onChange={(e) => setStockStatusFilter(e.target.value)}>
                        <option value="All">All Stock Status</option>
                        <option value="Healthy">Healthy Stock</option>
                        <option value="Low/Critical">Low / Critical</option>
                    </select>
                </div>
            </div>

            {/* Inventory Table with Editable Stock */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                            <tr>
                                <th className="py-2 px-4 text-left font-bold">ID</th>
                                <th className="py-2 px-4 text-left font-bold">Product</th>
                                {/* <th className="py-2 px-4 text-left font-bold">Vendor</th> */}
                                <th className="py-2 px-4 text-left font-bold">Category</th>
                                {/* <th className="py-2 px-4 text-left font-bold cursor-pointer hover:bg-purple-700 flex items-center gap-2" onClick={() => requestSort('currentStock')}>
                                    Current Stock {getSortIcon('currentStock')}
                                </th> */}
                                <th className="py-2 px-4 text-left font-bold">Sold (30d)</th>
                                <th className="py-2 px-4 text-left font-bold">Price</th>
                                <th className="py-2 px-4 text-left font-bold">Value</th>
                                <th className="py-2 px-4 text-left font-bold">Status</th>
                                <th className="py-2 px-4text-center font-bold">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {sorted.map((item) => (
                                <tr key={item.id} className={`hover:bg-purple-50 transition ${item.status !== 'Healthy' ? 'bg-red-50' : ''}`}>
                                    <td className="py-2 px-4font-bold text-purple-600">#{item.id}</td>
                                    <td className="py-5 px-6">
                                        <div className="font-semibold text-gray-800">{item.name}</div>
                                        <div className="text-sm text-gray-500">SKU: {item.sku}</div>
                                    </td>
                                    {/* <td className="py-2 px-4text-gray-700">{item.vendor}</td> */}
                                    <td className="py-2 px-4text-gray-600">{item.category}</td>

                                    {/* Editable Stock */}
                                    <td className="py-2 px-4text-center">
                                        {editingId === item.id ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <input
                                                    type="number"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="w-20 px-3 py-2 border-2 border-purple-500 rounded-lg text-center font-bold"
                                                    autoFocus
                                                />
                                                <button onClick={() => saveStock(item.id)} className="text-green-600 hover:text-green-800">
                                                    <Save size={20} />
                                                </button>
                                                <button onClick={cancelEdit} className="text-red-600 hover:text-red-800">
                                                    <X size={20} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-3">
                                                <span className={`text-2xl font-bold ${item.currentStock < item.minStock ? 'text-red-600' : 'text-gray-800'}`}>
                                                    {item.currentStock}
                                                </span>
                                                <button
                                                    onClick={() => handleEditStock(item.id, item.currentStock)}
                                                    className="text-purple-600 hover:text-purple-800 transition"
                                                >
                                                    <Edit2 size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </td>

                                    <td className="py-2 px-4text-center font-bold text-blue-600">{item.soldLast30}</td>
                                    <td className="py-2 px-4font-medium">�, {item.price.toLocaleString()}</td>
                                    <td className="py-2 px-4font-bold text-green-600">৳ {item.totalValue.toLocaleString()}</td>
                                    <td className="py-2 px-4text-center">
                                        <button className="text-purple-600 hover:text-purple-800 transition">
                                            <MoreVertical size={24} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-8 py-6 bg-gradient-to-r from-purple-50 to-pink-50 border-t-4 border-purple-300">
                    <div className="flex flex-col md:flex-row justify-between items-center text-lg font-semibold">
                        <p className="text-gray-700">
                            Total Inventory Value: <span className="text-purple-700 font-bold">৳ {(totalValue / 100000).toFixed(1)} Lac</span>
                        </p>
                        <p className="text-gray-700">
                            Items to Restock: <span className="text-red-600 font-bold">{lowStockCount}</span>
                        </p>
                        <p className="text-gray-600 text-sm mt-2">Last updated: November 20, 2025 • Real-time stock editing enabled</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InventoryManagementPage;