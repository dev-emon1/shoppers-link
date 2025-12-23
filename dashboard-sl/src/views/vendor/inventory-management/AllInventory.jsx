import React, { useState, useEffect, useMemo } from 'react';
import { Search, Edit2, Save, X, AlertTriangle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../../utils/AuthContext';
import API from '../../../utils/api';

const AllProductsVariantStockPage = () => {
    const { user } = useAuth();

    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({});
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const [editingVariantId, setEditingVariantId] = useState(null);
    const [editStockValue, setEditStockValue] = useState('');

    // নতুন state যোগ করলাম – alert দেখানোর জন্য
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    // console.log(user.id);

    /** Fetch products */
    const fetchProducts = async (pageNumber = 1) => {
        try {
            setLoading(true);

            const res = await API.get(`/stockIn/list?page=${pageNumber}`);
            const api = res.data.data;

            // Filter vendor products
            const vendorProducts = api.data.filter(
                item => item.vendor?.user_id === user.id
            );
            console.log(res);

            setProducts(vendorProducts);

            // Correct pagination
            setPagination({
                currentPage: api.current_page,
                lastPage: api.last_page,
                total: api.total,
                perPage: api.per_page
            });

        } catch (err) {
            setError("Failed to load products. Please try again.");
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchProducts(page);
    }, [page]);

    // Success alert দেখানোর জন্য useEffect
    useEffect(() => {
        if (showSuccessMessage) {
            alert("Stock updated successfully!");
            setShowSuccessMessage(false); // reset
        }
    }, [showSuccessMessage]);

    const handleEditStock = (variantId, currentStock) => {
        setEditingVariantId(variantId);
        setEditStockValue(currentStock.toString());
    };

    const saveStock = async () => {
        if (!editingVariantId || editStockValue === '' || isNaN(editStockValue)) {
            alert("Please enter a valid stock quantity");
            return;
        }

        const newStock = parseInt(editStockValue);

        try {
            const res = await API.post("/inventory/increase", {
                variant_id: editingVariantId,
                qty: newStock,
            });

            if (res.data.success || res.data.message === "Stock increased") {

                const updatedStock = res.data.new_stock;
                const updatedId = res.data.variant_id;

                setProducts(prev =>
                    prev.map(product => ({
                        ...product,
                        variants: product.variants?.map(variant =>
                            Number(variant.id) === Number(updatedId)
                                ? { ...variant, stock: updatedStock }
                                : variant
                        )
                    }))
                );

                setEditingVariantId(null);
                setEditStockValue('');
                setShowSuccessMessage(true);
            }
            else {
                alert("Failed: " + (res.data.message || "Unknown error"));
            }
        } catch (err) {
            console.error("Error updating stock:", err);
            alert("Failed to update stock. Please try again.");
        }
    };


    const cancelEdit = () => {
        setEditingVariantId(null);
        setEditStockValue('');
    };

    const filteredProducts = useMemo(() => {
        return products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [products, searchTerm]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin">
                    <RefreshCw size={40} className="text-purple-600" />
                </div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center py-20 text-red-600 text-xl">{error}</div>;
    }

    return (
        <div className="px-6 bg-gray-50 min-h-screen">

            {/* Header */}
            <div className="md:flex justify-between items-center mb-2">
                <div className='mb-2 md:mb-0'>
                    <h1 className="text-xl font-bold text-gray-800">All Products & Variant Stock</h1>
                    <p className="text-gray-600 mt-1">Real-time stock per variant • Inline update</p>
                </div>
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-4 top-3 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search product name, SKU..."
                        className="w-full pl-10 py-2 border rounded-lg focus:outline-none focus:border-main"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-main text-white">
                            <tr>
                                <th className="py-4 px-6 text-left font-bold">Product Name</th>
                                <th className="py-4 px-6 text-left font-bold">Variants (Stock)</th>
                                {/* <th className="py-4 px-6 text-center font-bold">Action</th> */}
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-gray-200">
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center py-10 text-gray-500">
                                        No products found
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map(product => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition">
                                        <td className="py-5 px-6">
                                            <div className="font-bold text-gray-800">{product.name}</div>
                                            <div className="text-xs text-gray-500">SKU: {product.sku || '—'}</div>
                                        </td>

                                        <td className="py-5 px-6">
                                            <div className="space-y-3">
                                                {product.variants?.length > 0 ? (
                                                    product.variants.map(variant => (
                                                        <div key={variant.id} className="flex items-center justify-between gap-6">
                                                            <div className="flex items-center gap-4">
                                                                <span className="px-4 py-1 bg-purple-100 text-main rounded-full text-sm font-semibold">
                                                                    {variant.id}
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
                                                                        <span className={`text-xl font-bold ${variant.stock === 0 ? 'text-red-600' :
                                                                            variant.stock < 20 ? 'text-orange-600' : 'text-green-600'
                                                                            }`}>
                                                                            {variant.stock}
                                                                            {variant.stock === 0 && <AlertTriangle className="inline ml-2" size={18} />}
                                                                        </span>
                                                                        <button
                                                                            onClick={() => handleEditStock(variant.id, variant.stock)}
                                                                            className="text-main hover:text-mainHover"
                                                                        >
                                                                            <Edit2 size={18} />
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

                                        {/* <td className="py-5 px-6 text-center">
                                            <button className="text-blue-600 hover:underline text-sm font-medium">
                                                View Details
                                            </button>
                                        </td> */}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-between items-center p-4 bg-gray-100 border-t">
                    <button
                        disabled={pagination.currentPage === 1}
                        onClick={() => setPage(p => Math.max(p - 1, 1))}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
                    >
                        Previous
                    </button>

                    <span className="font-semibold">
                        Page {pagination.currentPage} of {pagination.lastPage}
                    </span>

                    <button
                        disabled={pagination.currentPage === pagination.lastPage}
                        onClick={() => setPage(p => Math.min(p + 1, pagination.lastPage))}
                        className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 transition"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AllProductsVariantStockPage;