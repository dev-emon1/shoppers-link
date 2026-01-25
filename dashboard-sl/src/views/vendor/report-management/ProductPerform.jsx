import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Search, Download, TrendingUp, Package, DollarSign, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import API from '../../../utils/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { TbCoinTaka } from 'react-icons/tb';

// CSV Export
const downloadCSV = (data, filename = 'product-performance-report.csv') => {
    const headers = ['Product Name', 'SKU', 'Shop', 'Stock Quantity', 'All Time Sold', 'Period Sold', 'Period Revenue', 'Avg Price', 'Orders Count'];
    const rows = data.map(item => [
        item.name,
        item.sku,
        item.shop_name,
        item.stock_quantity,
        item.all_time_sold,
        item.period_sold,
        `৳${parseFloat(item.period_revenue).toFixed(2)}`,
        `৳${parseFloat(item.avg_price).toFixed(2)}`,
        item.orders_count
    ]);

    const csvContent = [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
};

// PDF Export
const downloadPDF = (products, summary) => {
    // 'l' for landscape often fits product reports with many columns better
    const doc = new jsPDF('l', 'mm', 'a4');

    // REMOVED: autoTable(doc); <--- This was the cause of the error

    let yPos = 20;

    // Header
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Product Performance Report', 14, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}`, 14, yPos);
    yPos += 10;

    if (summary?.date_range) {
        doc.text(`Period: ${summary.date_range}`, 14, yPos);
        yPos += 10;
    }

    // Summary Table
    if (summary) {
        doc.setFontSize(12);
        doc.setTextColor(30);
        doc.text('Summary', 14, yPos);

        autoTable(doc, {
            head: [['Metric', 'Value']],
            body: [
                ['Total Products with Sales', summary.total_products_with_sales || 0],
                ['Period Units Sold', summary.period_units_sold || 0],
                ['Period Revenue', summary.period_revenue || '৳0.00'],
                ['Top Product', summary.top_product || '-'],
                ['Top Revenue', summary.top_period_revenue || '৳0.00'],
            ],
            startY: yPos + 5,
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246], textColor: 255 },
            styles: { fontSize: 10 },
            margin: { left: 14 },
            tableWidth: 100 // Constrain summary table width
        });

        yPos = doc.lastAutoTable.finalY + 15;
    }

    // Detailed Table Title
    doc.setFontSize(14);
    doc.setTextColor(30);
    doc.text('Product Performance Details', 14, yPos);

    const tableData = products.map(item => [
        item.name,
        item.sku,
        item.shop_name || '-',
        item.stock_quantity.toString(),
        item.all_time_sold.toString(),
        item.period_sold.toString(),
        `৳ ${parseFloat(item.period_revenue).toFixed(2)}`,
        `৳ ${parseFloat(item.avg_price).toFixed(2)}`,
        item.orders_count.toString()
    ]);

    // Main Table
    autoTable(doc, {
        head: [['Product Name', 'SKU', 'Shop', 'Stock', 'All Time Sold', 'Period Sold', 'Period Revenue', 'Avg Price', 'Orders']],
        body: tableData,
        startY: yPos + 5,
        theme: 'striped',
        headStyles: { fillColor: [41, 98, 255], textColor: 255, fontStyle: 'bold' },
        styles: { fontSize: 8, cellPadding: 3 },
        alternateRowStyles: { fillColor: [245, 250, 255] },
        columnStyles: {
            0: { cellWidth: 50 },
            1: { cellWidth: 30 },
            6: { halign: 'right' },
            7: { halign: 'right' },
        },
        margin: { left: 14, right: 14 },
    });

    // Page numbers
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(9);
        doc.setTextColor(150);
        doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
    }

    doc.save(`product-performance-report-${new Date().toISOString().split('T')[0]}.pdf`);
};
const ProductPerformanceReportPage = () => {
    const [products, setProducts] = useState([]);
    const [summary, setSummary] = useState(null);
    const [meta, setMeta] = useState({ current_page: 1, total: 0, per_page: 20 });
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const fetchData = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            const res = await API.get("/reports/product-performance", { params: { page } });

            const { data = [], summary = null, meta: responseMeta = {} } = res.data || {};

            setProducts(Array.isArray(data) ? data : []);
            setSummary(summary);
            setMeta({
                current_page: responseMeta.current_page || 1,
                total: responseMeta.total || 0,
                per_page: responseMeta.per_page || 20,
            });
            setCurrentPage(responseMeta.current_page || 1);
        } catch (error) {
            console.error("Failed to fetch product performance data:", error);
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
        return products.filter(p =>
            p.name?.toLowerCase().includes(term) ||
            p.sku?.toLowerCase().includes(term) ||
            p.shop_name?.toLowerCase().includes(term)
        );
    }, [products, searchTerm]);

    const formatCurrency = (value) => {
        const num = parseFloat(value);
        return `৳ ${num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    const totalPages = Math.ceil(meta.total / meta.per_page);

    const handleExportCSV = () => {
        const filename = `product-performance-${new Date().toISOString().split('T')[0]}.csv`;
        downloadCSV(filteredProducts, filename);
    };

    const handleExportPDF = () => {
        downloadPDF(filteredProducts, summary);
    };

    if (loading) {
        return <div className="px-6 py-20 text-center text-gray-600">Loading product performance data...</div>;
    }

    return (
        <div className="px-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">Product Performance Report</h1>
                        <p className="text-gray-600 mt-1 text-sm">{summary?.date_range || 'All time performance'}</p>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={handleExportCSV} className="flex items-center gap-2 bg-main text-white px-4 py-1.5 text-sm rounded-lg hover:bg-mainHover transition font-medium">
                            <Download size={16} /> Export CSV
                        </button>
                        <button onClick={handleExportPDF} className="flex items-center gap-2 bg-main text-white px-4 py-1.5 text-sm rounded-lg hover:bg-mainHover transition font-medium">
                            <Download size={16} /> Export PDF
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                {summary && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mb-2">
                        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                            <div className="flex items-center gap-3">
                                <Package className="text-blue-600" size={24} />
                                <div>
                                    <p className="text-sm text-gray-600">Products with Sales</p>
                                    <p className="text-xl font-bold text-gray-900 mt-1">{summary.total_products_with_sales || 0}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                            <div className="flex items-center gap-3">
                                <ShoppingCart className="text-green-600" size={24} />
                                <div>
                                    <p className="text-sm text-gray-600">Units Sold (Period)</p>
                                    <p className="text-xl font-bold text-green-600 mt-1">{summary.period_units_sold || 0}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                            <div className="flex items-center gap-3">
                                <TbCoinTaka className="text-indigo-600" size={24} />
                                <div>
                                    <p className="text-sm text-gray-600">Period Revenue</p>
                                    <p className="text-xl font-bold text-indigo-600 mt-1">{summary.period_revenue || '৳0.00'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
                            <div className="flex items-center gap-3">
                                <TrendingUp className="text-purple-600" size={24} />
                                <div>
                                    <p className="text-sm text-gray-600">Top Product</p>
                                    <p className="text-sm font-bold text-purple-800 mt-1 truncate text-wrap">{summary.top_product || '-'}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                            <div className="flex items-center gap-3">
                                <TbCoinTaka className="text-orange-600" size={32} />
                                <div>
                                    <p className="text-sm text-gray-600">Top Revenue</p>
                                    <p className="text-xl font-bold text-orange-600 mt-1">{summary.top_period_revenue || '৳0.00'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Search */}
                <div className="bg-white rounded-xl shadow-sm p-2 mb-2">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by product name, SKU or shop..."
                            className="w-full pl-12 pr-5 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-main"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-gray-50 text-xs font-semibold uppercase text-gray-700 border-b">
                                <tr>
                                    <th className="py-4 px-6 text-left">Product Name</th>
                                    <th className="py-4 px-6 text-left">SKU</th>
                                    <th className="py-4 px-6 text-left">Shop</th>
                                    <th className="py-4 px-6 text-center">Stock</th>
                                    <th className="py-4 px-6 text-center">All Time Sold</th>
                                    <th className="py-4 px-6 text-center">Period Sold</th>
                                    <th className="py-4 px-6 text-right">Period Revenue</th>
                                    <th className="py-4 px-6 text-right">Avg Price</th>
                                    <th className="py-4 px-6 text-center">Orders</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="9" className="py-16 text-center text-gray-500">
                                            No products found
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition">
                                            <td className="py-5 px-6">
                                                <p className="font-medium text-gray-900">{product.name}</p>
                                            </td>
                                            <td className="py-5 px-6 text-gray-600 font-mono text-xs">{product.sku}</td>
                                            <td className="py-5 px-6 text-gray-700">{product.shop_name || '-'}</td>
                                            <td className="py-5 px-6 text-center font-semibold">{product.stock_quantity}</td>
                                            <td className="py-5 px-6 text-center">{product.all_time_sold}</td>
                                            <td className="py-5 px-6 text-center font-medium text-green-600">{product.period_sold}</td>
                                            <td className="py-5 px-6 text-right font-bold text-indigo-600">
                                                {formatCurrency(product.period_revenue)}
                                            </td>
                                            <td className="py-5 px-6 text-right text-gray-700">
                                                {formatCurrency(product.avg_price)}
                                            </td>
                                            <td className="py-5 px-6 text-center">{product.orders_count}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="px-6 py-4 bg-gray-50 border-t flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">
                        <div>
                            Showing {filteredProducts.length} of {meta.total} products
                        </div>
                        <div className="flex items-center gap-2 mt-3 sm:mt-0">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                disabled={currentPage === 1}
                                className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <span className="px-4 py-2 bg-white border rounded font-medium">
                                Page {currentPage} of {totalPages || 1}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="p-2 rounded hover:bg-gray-200 disabled:opacity-50"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductPerformanceReportPage;