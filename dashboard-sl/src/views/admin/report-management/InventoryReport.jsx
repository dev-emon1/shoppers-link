import React, { useState, useMemo } from 'react';
import { Search, Download, AlertTriangle, Package, TrendingUp, Filter } from 'lucide-react';

const InventoryReportPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [stockFilter, setStockFilter] = useState('All');
    const [sortConfig, setSortConfig] = useState({ key: 'stock', direction: 'asc' });

    // Realistic Fashion Inventory - November 19, 2025
    const inventoryData = [
        { id: "P28471", name: "Cotton Panjabi for Men - White", vendor: "Aarong", category: "Men's Wear", sku: "AAR-PAN-101", stock: 87, soldLast30: 312, price: 2850, totalValue: 247950, velocity: 10.4, status: "Healthy" },
        { id: "P28473", name: "Katan Benarasi Saree - Red/Gold", vendor: "Kay Kraft", category: "Women's Wear", sku: "KK-BEN-005", stock: 18, soldLast30: 89, price: 18500, totalValue: 333000, velocity: 4.9, status: "Low Stock" },
        { id: "P28475", name: "Hand-Embroidered Salwar Kameez - Pink", vendor: "Anjan's", category: "Women's Wear", sku: "ANJ-SK-212", stock: 35, soldLast30: 156, price: 6750, totalValue: 236250, velocity: 5.2, status: "Healthy" },
        { id: "P28472", name: "Block Printed Tangail Sharee", vendor: "Tangail Saree Kuthir", category: "Women's Wear", sku: "TSK-TAN-078", stock: 42, soldLast30: 198, price: 4200, totalValue: 176400, velocity: 6.6, status: "Healthy" },
        { id: "P28474", name: "Leather Nagra Sandals (Size 40-44)", vendor: "Bata Heritage", category: "Footwear", sku: "BATA-NAG-09", stock: 8, soldLast30: 420, price: 1990, totalValue: 15920, velocity: 14.0, status: "Critical" },
        { id: "P28476", name: "Kids Frock - Floral Print (Age 5-10)", vendor: "Rang Bangladesh", category: "Kids Wear", sku: "RNG-KID-045", stock: 120, soldLast30: 289, price: 1450, totalValue: 174000, velocity: 9.6, status: "Healthy" },
        { id: "P28477", name: "Nokshi Katha Cushion Cover Set", vendor: "Sylhet Nakshi House", category: "Accessories", sku: "SNK-NOK-003", stock: 3, soldLast30: 67, price: 890, totalValue: 2670, velocity: 2.2, status: "Out of Stock Soon" },
        { id: "P28478", name: "Winter Shawl - Kashmiri Embroidery", vendor: "Deshal by Bibiana", category: "Winter Wear", sku: "DB-WIN-112", stock: 56, soldLast30: 378, price: 3200, totalValue: 179200, velocity: 12.6, status: "Healthy" },
    ];

    // Filtering & Sorting
    const filteredInventory = useMemo(() => {
        return inventoryData.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.sku.includes(searchTerm) ||
                item.vendor.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStock = stockFilter === 'All' ||
                (stockFilter === 'Low' && (item.status === 'Low Stock' || item.status === 'Critical' || item.status === 'Out of Stock Soon')) ||
                (stockFilter === 'Healthy' && item.status === 'Healthy');
            return matchesSearch && matchesStock;
        });
    }, [searchTerm, stockFilter]);

    const sortedInventory = useMemo(() => {
        let sortable = [...filteredInventory];
        if (sortConfig.key) {
            sortable.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];
                if (typeof aVal === 'string') {
                    aVal = aVal.toLowerCase();
                    bVal = bVal.toLowerCase();
                }
                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return sortable;
    }, [filteredInventory, sortConfig]);

    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc';
        setSortConfig({ key, direction });
    };

    const totalStockValue = inventoryData.reduce((sum, item) => sum + item.totalValue, 0);
    const lowStockItems = inventoryData.filter(i => i.status !== 'Healthy').length;

    const getStatusColor = (status) => {
        switch (status) {
            case 'Critical': return 'bg-red-100 text-red-800';
            case 'Low Stock': return 'bg-orange-100 text-orange-800';
            case 'Out of Stock Soon': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-green-100 text-green-800';
        }
    };

    return (
        <div className="px-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">Inventory Report</h1>
                    <p className="text-gray-600">Live Stock Status • As of November 19, 2025, 6:00 PM</p>
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
                    <p className="text-sm text-gray-600">Total Stock Value</p>
                    <p className="text-2xl font-bold text-main">৳ {(totalStockValue / 100000).toFixed(1)} Lac</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow border-l-4 border-main">
                    <p className="text-sm text-gray-600">Total SKUs</p>
                    <p className="text-2xl font-bold text-main">{inventoryData.length}</p>
                </div>
                <div className="bg-white p-5 rounded-lg shadow border-l-4 border-main">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Low/Critical Stock</p>
                            <p className="text-2xl font-bold text-red">{lowStockItems}</p>
                        </div>
                        <AlertTriangle className="text-red" size={32} />
                    </div>
                </div>
                <div className="bg-white p-5 rounded-lg shadow border-l-4 border-main">
                    <p className="text-sm text-gray-600">Avg. Sales Velocity</p>
                    <p className="text-2xl font-bold text-main">8.1 units/day</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-5 mb-6 flex flex-col md:flex-row gap-4 text-sm">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by product name, SKU or vendor..."
                            className="w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:border-main"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <select
                    className="px-4 py-3 border rounded-lg"
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                >
                    <option value="All">All Stock Levels</option>
                    <option value="Healthy">Healthy Stock</option>
                    <option value="Low">Low / Critical</option>
                </select>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                            <tr>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('id')}>ID</th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('name')}>Product Name</th>
                                <th className="py-4 px-6 text-left">Vendor</th>
                                <th className="py-4 px-6 text-left">Category</th>
                                <th className="py-4 px-6 text-left">SKU</th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('stock')}>Current Stock</th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('soldLast30')}>Sold (30d)</th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('velocity')}>Velocity/day</th>
                                <th className="py-4 px-6 text-left cursor-pointer hover:bg-gray-100" onClick={() => requestSort('totalValue')}>Stock Value</th>
                                <th className="py-4 px-6 text-left">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {sortedInventory.map((item) => (
                                <tr key={item.id} className={`hover:bg-gray-50 transition ${item.status !== 'Healthy' ? 'bg-red-50' : ''}`}>
                                    <td className="py-2 px-2 font-bold text-main">#{item.id}</td>
                                    <td className="py-2 px-2 font-medium">{item.name}</td>
                                    <td className="py-2 px-2 text-gray-700">{item.vendor}</td>
                                    <td className="py-2 px-2 text-gray-600">{item.category}</td>
                                    <td className="py-2 px-2 font-mono text-xs">{item.sku}</td>
                                    <td className="py-2 px-2 text-center font-bold text-lg">{item.stock}</td>
                                    <td className="py-2 px-2 text-center font-semibold text-main">{item.soldLast30}</td>
                                    <td className="py-2 px-2 text-center font-medium">{item.velocity}</td>
                                    <td className="py-2 px-2 font-bold text-main">৳ {item.totalValue.toLocaleString()}</td>
                                    <td className="py-2 px-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(item.status)}`}>
                                            {item.status === 'Critical' && <AlertTriangle size={14} />}
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t text-sm text-gray-600">
                    Total Items in Stock: {inventoryData.reduce((sum, i) => sum + i.stock, 0)} units •
                    Total Inventory Value: ৳ {(totalStockValue / 100000).toFixed(1)} Lac •
                    {lowStockItems > 0 && <span className="text-main font-medium"> ⚠ {lowStockItems} items need urgent restock!</span>}
                </div>
            </div>
        </div>
    );
};

export default InventoryReportPage;