import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Copy, Calendar, ChevronLeft, ChevronRight, Plus, Users, ShoppingBag, Trash2, Edit, Package, X, ListChecks } from 'lucide-react';
import API, { IMAGE_URL } from '../../../utils/api';
import { toast } from 'react-toastify';

const AllCoupon = () => {
    const navigate = useNavigate();
    const [coupons, setCoupons] = useState([]);
    const [allProducts, setAllProducts] = useState([]); // প্রোডাক্ট লিস্টের জন্য
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCouponProducts, setSelectedCouponProducts] = useState([]);
    const [activeCouponTitle, setActiveCouponTitle] = useState("");

    const fetchCoupons = async (page = 1) => {
        setLoading(true);
        try {
            // Coupons এবং Products একসাথে ফেচ করা হচ্ছে নাম দেখানোর জন্য
            const [couponRes, productRes] = await Promise.all([
                API.get(`/coupons?page=${page}`),
                API.get('/products?per_page=1000')
            ]);

            setCoupons(couponRes.data.data || []);
            setMeta(couponRes.data.meta);
            setAllProducts(productRes.data.data || []);
            setLoading(false);
        } catch (err) {
            setError("Coupons could not be loaded.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons(currentPage);
    }, [currentPage]);

    // ID থেকে প্রোডাক্টের নাম বের করার ফাংশন
    const handleViewProducts = (coupon) => {
        if (!coupon.applicable_products || coupon.applicable_products.length === 0) {
            toast.info("This coupon is applicable to all products.");
            return;
        }

        const productDetails = coupon.applicable_products.map(id => {
            const product = allProducts.find(p => p.id === id);
            // console.log(product);

            return {
                name: product ? product.name : `Product ID: ${id}`,
                image: product ? product.primary_image : null // আপনার ডাটাবেস অনুযায়ী কলামের নাম thumb_image বা image হবে
            };
        });
        setSelectedCouponProducts(productDetails);
        setActiveCouponTitle(coupon.title);
        setIsModalOpen(true);
    };
    console.log(selectedCouponProducts);

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        toast.success(`Coupon ${code} copied!`);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this coupon?")) {
            try {
                await API.delete(`/coupons/${id}`);
                toast.success("Coupon deleted successfully");
                fetchCoupons(currentPage);
            } catch (err) {
                toast.error("Failed to delete coupon");
            }
        }
    };

    if (loading) return <div className="text-center py-20 italic text-gray-500">Loading coupons...</div>;
    if (error) return <div className="text-center py-20 text-red-500">{error}</div>;

    return (
        <div className="max-w-7xl mx-auto px-6 relative">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Promotional Coupons</h1>
                    <p className="text-gray-500 text-sm">Monitor performance and manage discount logic.</p>
                </div>
                <Link to="/admin/coupons/add-coupon" className="flex items-center gap-2 bg-main hover:bg-mainHover text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-blue-100 text-sm">
                    <Plus size={20} /> Add New Coupon
                </Link>
            </div>

            {coupons.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed rounded-3xl border-gray-200 bg-white">
                    <p className="text-gray-400 font-medium">No coupons found in the database.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {coupons.map((coupon) => (
                        <div key={coupon.id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all relative group overflow-hidden flex flex-col justify-between">

                            <div>
                                {/* Status & Type Badge */}
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex flex-col gap-1">
                                        <span className={`w-fit px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${coupon.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                            {coupon.is_active ? 'Active' : 'Disabled'}
                                        </span>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md w-fit ${coupon.vendor_id ? 'text-orange-500 bg-orange-50' : 'text-blue-500 bg-blue-50'}`}>
                                            {coupon.vendor_id ? 'VENDOR SPECIFIC' : 'PLATFORM WIDE'}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-gray-900 leading-none">
                                            {coupon.discount_type === 'percentage' ? `${parseFloat(coupon.discount_value)}%` : `৳${parseFloat(coupon.discount_value)}`}
                                        </p>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">Discount</p>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="mb-4">
                                    <h3 className="font-bold text-gray-800 text-lg leading-tight mb-1">{coupon.title}</h3>
                                    <p className="text-gray-400 text-xs line-clamp-2 min-h-[32px]">{coupon.description || 'Global store discount campaign.'}</p>
                                </div>

                                {/* Applicable Products Button */}
                                <button
                                    onClick={() => handleViewProducts(coupon)}
                                    className="w-full mb-5 flex items-center justify-center gap-2 py-2.5 bg-gray-50 hover:bg-main hover:text-white text-gray-600 rounded-xl text-xs font-bold transition-all border border-gray-100"
                                >
                                    <Package size={14} />
                                    {coupon.applicable_products?.length > 0
                                        ? `View ${coupon.applicable_products.length} Products`
                                        : "Applicable to All Products"}
                                </button>

                                {/* Coupon Code Box */}
                                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-2 flex justify-between items-center mb-4">
                                    <span className="font-mono font-bold text-xl text-main tracking-tighter">{coupon.code}</span>
                                    <button onClick={() => copyToClipboard(coupon.code)} className="p-2 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-main shadow-sm border border-transparent hover:border-gray-100">
                                        <Copy size={18} />
                                    </button>
                                </div>
                            </div>

                            {/* Database Schema Stats */}
                            <div>
                                <div className="grid grid-cols-2 gap-4 mb-6 border-y border-gray-50 py-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-blue-50 rounded-lg text-blue-500"><Users size={16} /></div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Used</p>
                                            <p className="text-sm font-bold text-gray-700">{coupon.used_count} / {coupon.usage_limit_total || '∞'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-purple-50 rounded-lg text-purple-500"><ShoppingBag size={16} /></div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">Min Spend</p>
                                            <p className="text-sm font-bold text-gray-700">৳{parseFloat(coupon.minimum_amount || 0)}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer & Actions */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center text-gray-400 text-[10px] font-bold italic">
                                        <Calendar size={12} className="mr-1" />
                                        Exp: {coupon.ends_at ? new Date(coupon.ends_at).toLocaleDateString() : 'Never'}
                                    </div>
                                    <div className="flex gap-1">
                                        <button onClick={() => navigate(`/admin/coupons/edit/${coupon.id}`)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-all">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(coupon.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}

            {/* PRODUCT MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                            <div>
                                <h2 className="font-bold text-gray-900 leading-none">Applicable Products</h2>
                                <p className="text-xs text-gray-500 mt-1">{activeCouponTitle}</p>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-4 max-h-[60vh] overflow-y-auto">
                            <div className="space-y-3">
                                {selectedCouponProducts.map((product, index) => (
                                    <div key={index} className="flex items-center gap-4 p-2 bg-white border border-gray-100 rounded-2xl hover:border-main/30 transition-all shadow-sm group">
                                        {/* Product Image */}
                                        <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-50 shrink-0">
                                            {product.image ? (
                                                <img
                                                    src={`${IMAGE_URL}/${product.image}`}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image' }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    <Package size={20} />
                                                </div>
                                            )}
                                        </div>

                                        {/* Product Name */}
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-sm font-bold text-gray-800 truncate leading-tight">
                                                {product.name}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-3 bg-gray-50 text-right">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2 bg-main text-white rounded-xl font-bold text-sm shadow-md"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pagination Controls */}
            {meta && meta.last_page > 1 && (
                <div className="mt-12 flex justify-center items-center gap-4">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => prev - 1)} className="p-2 rounded-xl border bg-white disabled:opacity-30 shadow-sm transition-all hover:bg-gray-50">
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-bold text-gray-600 bg-white px-4 py-2 rounded-xl border shadow-sm">
                        {meta.current_page} / {meta.last_page}
                    </span>
                    <button disabled={currentPage === meta.last_page} onClick={() => setCurrentPage(prev => prev + 1)} className="p-2 rounded-xl border bg-white disabled:opacity-30 shadow-sm transition-all hover:bg-gray-50">
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
};

export default AllCoupon;