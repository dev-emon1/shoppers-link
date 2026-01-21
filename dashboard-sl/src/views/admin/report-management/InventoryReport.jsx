import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Search, Download, ChevronDown, ChevronUp, Package, AlertTriangle, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../../../utils/api';
// CORRECT IMPORTS
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Helper to download CSV
const downloadCSV = (data, filename = 'inventory-report.csv') => {
    // Flatten products with variants for better CSV
    const rows = [];
    rows.push(['Product Name', 'Product SKU', 'Total Stock', 'Sold Count', 'Variant SKU', 'Variant Attributes', 'Variant Stock', 'Variant Price']);

    data.forEach(product => {
        if (!product.variants || product.variants.length === 0) {
            rows.push([
                product.name,
                product.sku,
                product.stock_quantity,
                product.sold_count,
                '',
                '',
                '',
                ''
            ]);
        } else {
            product.variants.forEach(variant => {
                const attrs = JSON.parse(variant.attributes || '{}');
                const attrString = Object.entries(attrs)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(' | ');

                rows.push([
                    product.name,
                    product.sku,
                    product.stock_quantity,
                    product.sold_count,
                    variant.sku,
                    attrString,
                    variant.stock,
                    `৳${parseFloat(variant.final_price).toFixed(2)}`
                ]);
            });
        }
    });

    const csvContent = rows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Helper to trigger PDF print
const downloadPDF = (products, summary) => {
    const doc = new jsPDF('l', 'mm', 'a4');

    let yPosition = 20;

    // 1. Header
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Inventory Report - Variant Wise', 10, yPosition);
    yPosition += 15;

    // 2. Summary Table
    if (summary) {
        // Use the imported autoTable function directly
        autoTable(doc, {
            head: [['Metric', 'Value']],
            body: [
                ['Total Products', summary.total_products || 0],
                ['In Stock', summary.in_stock || 0],
                ['Low Stock', summary.low_stock_items || 0],
                ['Out of Stock', summary.out_of_stock || 0],
            ],
            startY: yPosition,
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] },
            margin: { left: 10 },
            tableWidth: 80
        });
        yPosition = doc.lastAutoTable.finalY + 15;
    }

    // 3. Detailed Table Data Preparation
    const tableData = [];
    products.forEach(product => {
        if (!product.variants || product.variants.length === 0) {
            tableData.push([product.name, product.sku, product.stock_quantity, product.sold_count, '-', '-', '-', '-']);
        } else {
            product.variants.forEach(variant => {
                let attrString = "";
                try {
                    const attrs = typeof variant.attributes === 'string' ? JSON.parse(variant.attributes) : variant.attributes;
                    attrString = Object.entries(attrs || {}).map(([k, v]) => `${k}: ${v}`).join(' | ');
                } catch (e) { attrString = "N/A"; }

                tableData.push([
                    product.name,
                    product.sku,
                    product.stock_quantity,
                    product.sold_count,
                    variant.sku,
                    attrString,
                    variant.stock,
                    `৳ ${parseFloat(variant.final_price).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                ]);
            });
        }
    });

    // 4. Main Inventory Table
    autoTable(doc, {
        head: [['Product Name', 'Product SKU', 'Total Stock', 'Sold Count', 'Variant SKU', 'Variant Attributes', 'Variant Stock', 'Variant Price']],
        body: tableData,
        startY: yPosition,
        theme: 'striped',
        headStyles: { fillColor: [41, 98, 255] },
        styles: { fontSize: 8 },
        columnStyles: {
            0: { cellWidth: 45 },
            5: { cellWidth: 50 },
        },
        margin: { left: 10, right: 10 },
    });

    doc.save(`inventory-report-${new Date().toISOString().split('T')[0]}.pdf`);
};
const InventoryReportPage = () => {
    const [products, setProducts] = useState([]);
    const [summary, setSummary] = useState(null);
    const [meta, setMeta] = useState({ current_page: 1, total: 0, per_page: 50 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [currentPage, setCurrentPage] = useState(1);

    const printRef = useRef(); // For better PDF control if needed later

    const fetchData = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const res = await API.get("/reports/inventory", {
                params: { page }
            });

            const { data = [], summary = null, meta: responseMeta = {} } = res.data || {};

            setProducts(Array.isArray(data) ? data : []);
            setSummary(summary);
            setMeta({
                current_page: responseMeta.current_page || 1,
                total: responseMeta.total || 0,
                per_page: responseMeta.per_page || 50,
            });
            setCurrentPage(responseMeta.current_page || 1);
        } catch (error) {
            console.error("Failed to fetch inventory data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData(currentPage);
    }, [currentPage, fetchData]);

    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products;
        const term = searchTerm.toLowerCase();
        return products.filter(product =>
            product.name?.toLowerCase().includes(term) ||
            product.sku?.toLowerCase().includes(term)
        );
    }, [products, searchTerm]);

    const toggleRow = (productId) => {
        setExpandedRows(prev => {
            const newSet = new Set(prev);
            if (newSet.has(productId)) newSet.delete(productId);
            else newSet.add(productId);
            return newSet;
        });
    };

    const getStockStatus = (stock) => {
        if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
        if (stock < 10) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800' };
        return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
    };

    const formatCurrency = (value) => {
        const num = parseFloat(value);
        return `৳ ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const totalPages = Math.ceil(meta.total / meta.per_page);

    const handleExportCSV = () => {
        const filename = `inventory-report-variant-wise-${new Date().toISOString().split('T')[0]}.csv`;
        downloadCSV(filteredProducts, filename);
    };

    const handleExportPDF = () => {
        downloadPDF(filteredProducts, summary);
    };

    if (loading) {
        return (
            <div className="px-6 py-20 text-center">
                <p className="text-gray-600 text-lg">Loading inventory...</p>
            </div>
        );
    }

    return (
        <>
            {/* Print-friendly styles */}
            <style>{`
    @media print {
        body * { visibility: hidden; }
        #print-section, #print-section * { visibility: visible; }
        #print-section { position: absolute; left: 0; top: 0; width: 100%; }
        .no-print { display: none !important; }
        .bg-gray-50 { background: white !important; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ccc !important; padding: 8px !important; }
        .shadow-sm, .rounded-xl { box-shadow: none !important; border: 1px solid #ddd; }
    }
`}</style>

            <div className="px-6 bg-gray-50 min-h-screen" id="print-section">
                <div className="max-w-7xl mx-auto">

                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-2 no-print">
                        <div>
                            <h1 className="text-xl font-bold text-gray-800">Inventory Report</h1>
                            <p className="text-gray-600 mt-1 text-sm">Current stock levels and variant details</p>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleExportCSV}
                                className="flex items-center gap-2 bg-main text-white px-4 py-2 rounded-lg hover:bg-mainHover transition text-xs font-medium"
                            >
                                <Download size={16} />
                                Export CSV
                            </button>
                            <button
                                onClick={handleExportPDF}
                                className="flex items-center gap-2 bg-main text-white px-4 py-2 rounded-lg hover:bg-mainHover transition text-xs font-medium"
                            >
                                <Download size={16} />
                                Export PDF
                            </button>
                        </div>
                    </div>

                    {/* Summary Cards */}
                    {summary && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 mb-2 no-print">
                            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 ">
                                <div className="flex items-center gap-3">
                                    <Package size={32} className="text-blue-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Total Products</p>
                                        <p className="text-xl font-bold text-gray-900 mt-1">
                                            {summary.total_products || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <CheckCircle size={32} className="text-green-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">In Stock</p>
                                        <p className="text-xl font-bold text-green-600 mt-1">
                                            {summary.in_stock || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle size={32} className="text-yellow-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Low Stock</p>
                                        <p className="text-xl font-bold text-yellow-700 mt-1">
                                            {summary.low_stock_items || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                                <div className="flex items-center gap-3">
                                    <Package size={32} className="text-red-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Out of Stock</p>
                                        <p className="text-xl font-bold text-red-600 mt-1">
                                            {summary.out_of_stock || 0}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Search */}
                    <div className="bg-white rounded-xl shadow-sm p-2 mb-2 no-print">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search by product name or SKU..."
                                className="w-full pl-12 pr-5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-main transition"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-700 border-b border-gray-200">
                                    <tr>
                                        <th className="py-4 px-6 text-left">Product</th>
                                        <th className="py-4 px-6 text-left">SKU</th>
                                        <th className="py-4 px-6 text-center">Total Stock</th>
                                        <th className="py-4 px-6 text-center">Sold</th>
                                        <th className="py-4 px-6 text-center">Status</th>
                                        <th className="py-4 px-6 text-center">Variants</th>
                                        <th className="py-4 px-6 text-center no-print">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="py-16 text-center text-gray-500">
                                                {searchTerm ? 'No matching products found' : 'No products in inventory'}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredProducts.map((product) => {
                                            const status = getStockStatus(product.stock_quantity);
                                            const isExpanded = expandedRows.has(product.id);

                                            return (
                                                <React.Fragment key={product.id}>
                                                    <tr className="hover:bg-gray-50 transition">
                                                        <td className="py-5 px-6">
                                                            <p className="font-medium text-gray-900">{product.name}</p>
                                                        </td>
                                                        <td className="py-5 px-6 text-gray-600 font-mono text-xs">{product.sku}</td>
                                                        <td className="py-5 px-6 text-center font-bold text-lg">{product.stock_quantity}</td>
                                                        <td className="py-5 px-6 text-center text-gray-700">{product.sold_count}</td>
                                                        <td className="py-5 px-6 text-center">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
                                                                {status.label}
                                                            </span>
                                                        </td>
                                                        <td className="py-5 px-6 text-center text-gray-700">{product.variants?.length || 0}</td>
                                                        <td className="py-5 px-6 text-center no-print">
                                                            <button
                                                                onClick={() => toggleRow(product.id)}
                                                                className="text-main hover:text-mainHover transition"
                                                            >
                                                                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                                            </button>
                                                        </td>
                                                    </tr>

                                                    {isExpanded && product.variants?.length > 0 && (
                                                        <tr>
                                                            <td colSpan="7" className="bg-gray-50">
                                                                <div className="p-6">
                                                                    <h4 className="font-semibold text-gray-800 mb-4">Variants</h4>
                                                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                                        {product.variants.map((variant) => {
                                                                            const variantAttrs = JSON.parse(variant.attributes || '{}');
                                                                            const attrText = Object.entries(variantAttrs)
                                                                                .map(([key, value]) => `${key}: ${value}`)
                                                                                .join(' | ');

                                                                            const variantStatus = getStockStatus(variant.stock);

                                                                            return (
                                                                                <div key={variant.id} className="bg-white border border-gray-200 rounded-lg p-4">
                                                                                    <div className="flex justify-between items-start mb-2">
                                                                                        <p className="font-mono text-xs text-gray-600">{variant.sku}</p>
                                                                                        <span className={`px-2 py-1 rounded text-xs font-medium ${variantStatus.color}`}>
                                                                                            {variant.stock} in stock
                                                                                        </span>
                                                                                    </div>
                                                                                    <p className="text-sm text-gray-700 mb-2">{attrText}</p>
                                                                                    <p className="font-semibold text-main">
                                                                                        {formatCurrency(variant.final_price)}
                                                                                    </p>
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )}
                                                </React.Fragment>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="px-6 py-4 bg-gray-50 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600 no-print">
                            <div>
                                Showing {(currentPage - 1) * meta.per_page + 1} to{' '}
                                {Math.min(currentPage * meta.per_page, meta.total)} of {meta.total} products
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50">
                                    <ChevronLeft size={18} />
                                </button>
                                <span className="px-4 py-2 bg-white rounded-lg border font-medium">
                                    Page {currentPage} of {totalPages || 1}
                                </span>
                                <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-2 rounded-lg hover:bg-gray-200 disabled:opacity-50">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InventoryReportPage;