import React, { useState, useEffect } from "react";
import { Search, Edit2, Save, X, AlertTriangle, RefreshCw } from "lucide-react";
import { useAuth } from "../../../utils/AuthContext";
import API, { IMAGE_URL } from "../../../utils/api";
import { toast } from "react-toastify";

const AllProductsVariantStockPage = () => {
    const { user } = useAuth();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [editingVariantId, setEditingVariantId] = useState(null);
    const [editStockValue, setEditStockValue] = useState("");

    // Success Alert
    const [showSuccess, setShowSuccess] = useState(false);

    // Fetch Products
    // console.log(products);
    const fetchProducts = async (page = 1) => {
        try {
            setLoading(true);
            setError(null);

            const res = await API.get(`/stockIn/list?page=${page}`);
            const without_stock = res.data;
            const filteredData = without_stock.data.filter(item => {
                // Check if the id inside the category object is NOT 8
                return item.category?.id !== 8;
            });
            // console.log(filteredData);

            // Reconstruct the payload with the filtered data but keeping the original meta
            const payload = {
                ...without_stock,
                data: filteredData
            };
            if (!payload?.data) {
                setProducts([]);
                setTotalPages(1);
                return;
            }

            setProducts(payload.data);
            setTotalPages(payload.meta?.last_page || 1);
            setCurrentPage(payload.meta?.current_page || 1);

        } catch (err) {
            // console.error("API Error:", err);
            toast.error("Failed to load products. Please try again.");
            setError("Failed to load products. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) fetchProducts(currentPage);
    }, [currentPage, user?.id]);

    // Success Message
    useEffect(() => {
        if (showSuccess) {
            setTimeout(() => setShowSuccess(false), 3000);
        }
    }, [showSuccess]);

    // Edit Stock
    const handleEditStock = (variantId, currentStock) => {
        setEditingVariantId(variantId);
        setEditStockValue(currentStock);
    };

    const saveStock = async () => {
        if (!editingVariantId || editStockValue === "" || isNaN(editStockValue) || editStockValue < 0) {
            // alert("Please enter a valid stock number");
            toast.error("Please enter a valid stock number");
            return;
        }

        try {
            const res = await API.post("/inventory/increase", {
                variant_id: editingVariantId,
                qty: parseInt(editStockValue),
            });
            toast.success("Stock updated successfully");
            if (res.data.success || res.data.new_stock !== undefined) {
                setProducts(prev =>
                    prev.map(p => ({
                        ...p,
                        variants: p.variants?.map(v =>
                            Number(v.id) === Number(editingVariantId)
                                ? { ...v, stock: res.data.new_stock || parseInt(editStockValue) }
                                : v
                        ),
                    }))
                );

                setEditingVariantId(null);
                setEditStockValue("");
                setShowSuccess(true);
            }
        } catch (err) {
            // alert("Failed to update stock");
            // console.error(err);
            toast.error("Failed to update stock");
        }
    };

    const cancelEdit = () => {
        setEditingVariantId(null);
        setEditStockValue("");
    };

    // Search Filter
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <RefreshCw className="animate-spin text-main" size={48} />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-red-600 text-xl font-semibold">{error}</div>
            </div>
        );
    }

    return (
        <div className="px-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-800">All Products & Variant Stock</h1>
                    </div>
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-4 top-3 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search product name, SKU..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:border-main transition"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gradient-to-r from-main to-mainHover text-white">
                                <tr>
                                    <th className="px-8 py-2 text-left font-bold text-sm">Product Name</th>
                                    <th className="px-8 py-2 text-left font-bold text-sm">Variants (Stock)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan="2" className="text-center py-20 text-gray-500 text-md">
                                            No products found for your store.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map((product) => (
                                        <tr key={product.id} className="hover:bg-gray-50 transition">
                                            <td className="px-4 py-4">
                                                <div className="flex items-center gap-4">
                                                    {/* <img
                                                        src={
                                                            product?.primary_image
                                                                ? `${import.meta.env.VITE_IMAGE_URL}/${product.primary_image}`
                                                                : "/images/default.jpg"
                                                        }
                                                        alt={product.name}
                                                        className="w-12 h-12 rounded-lg object-cover border"
                                                    /> */}
                                                    <div>
                                                        <div className="font-bold text-gray-900 text-sm">{product.name}</div>
                                                        <div className="text-xs text-gray-500 font-mono">SKU: {product.sku || "—"}</div>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="py-2 px-6">
                                                <div className="space-y-3">
                                                    {product.variants?.length > 0 ? (
                                                        product.variants.map((variant, index) => (
                                                            <div key={variant.id} className="flex items-center justify-between gap-6">
                                                                <div className="flex items-center gap-4">
                                                                    <span className="px-4 py-1 bg-purple-100 text-main rounded-full text-sm font-semibold">
                                                                        {index + 1}
                                                                    </span>
                                                                    <span className="text-xs text-gray-500 font-mono">
                                                                        {variant.sku || '—'}
                                                                    </span>
                                                                </div>

                                                                <div className="flex items-center gap-3">
                                                                    {Number(editingVariantId) === Number(variant.id) ? (
                                                                        <>
                                                                            <input
                                                                                type="number"
                                                                                value={editStockValue}
                                                                                onChange={(e) => setEditStockValue(e.target.value)}
                                                                                className="w-24 px-3 py-2 border-2 border-main rounded-lg text-center font-bold focus:outline-none"
                                                                                autoFocus
                                                                                min="0"
                                                                            />
                                                                            <button onClick={saveStock} className="text-secondary hover:text-green-800">
                                                                                <Save size={20} />
                                                                            </button>
                                                                            <button onClick={cancelEdit} className="text-red-600 hover:text-red-800">
                                                                                <X size={20} />
                                                                            </button>
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <span className={`text-lg font-bold ${variant.stock === 0 ? 'text-red-600' :
                                                                                variant.stock < 20 ? 'text-orange-600' : 'text-green-600'
                                                                                }`}>
                                                                                {variant.stock}
                                                                                {variant.stock === 0 && <AlertTriangle className="inline ml-2" size={18} />}
                                                                            </span>
                                                                            <button
                                                                                onClick={() => handleEditStock(variant.id, variant.stock)}
                                                                                className="text-main hover:text-mainHover"
                                                                            >
                                                                                <Edit2 size={16} />
                                                                            </button>
                                                                        </>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-500 text-sm">No variants</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center px-8 py-4 bg-gray-50 border-t">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-6 py-3 bg-white border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition"
                            >
                                Previous
                            </button>
                            <span className="font-semibold text-gray-700">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-6 py-3 bg-white border rounded-lg disabled:opacity-50 hover:bg-gray-100 transition"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AllProductsVariantStockPage;