import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Info, Settings, Calendar, ShieldCheck, Tag, Search } from 'lucide-react';
import API, { IMAGE_URL } from '../../../utils/api';
import { toast } from 'react-toastify';

const CreateCoupon = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({}); // ভ্যালিডেশন এরর হ্যান্ডেল করার জন্য

    // API Data for selection
    const [productList, setProductList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [searchTerm, setSearchTerm] = useState({ product: '', category: '' });
    const [formData, setFormData] = useState({
        code: '',
        title: '',
        description: '',
        discount_value: '',
        discount_type: 'percentage',
        max_discount_amount: '',
        minimum_amount: '',
        exclude_sale_items: false,
        free_shipping: false,
        usage_limit_total: '',
        usage_limit_per_user: 1,
        starts_at: '',
        ends_at: '',
        is_active: true,
        applicable_products: [], // stores IDs
        applicable_categories: [] // stores IDs
    });
    // Fetch Products and Categories on load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [resProd, resCat] = await Promise.all([
                    API.get('/products?per_page=100'),
                    API.get('/categories?per_page=100')
                ]);
                setProductList(resProd.data.data);
                setCategoryList(resCat.data.data);
            } catch (err) {
                console.error("Error fetching lists", err);
            }
        };
        fetchData();
    }, []);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            // [name]: type === 'checkbox' ? checked : value
            [name]: name === 'code' ? value.toUpperCase() : (type === 'checkbox' ? checked : value)
        }));
    };
    // Multi-select handlers
    const toggleSelection = (id, field) => {
        setFormData(prev => {
            const currentItems = prev[field];
            const isSelected = currentItems.includes(id);
            return {
                ...prev,
                [field]: isSelected
                    ? currentItems.filter(item => item !== id)
                    : [...currentItems, id]
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await API.post('/coupons', formData);
            toast.success(response.data.message);
            navigate('/admin/coupons/all-coupons');
        } catch (err) {
            if (err.response?.status === 422) setErrors(err.response.data.errors);
            else toast.error("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-6 bg-gray-50 min-h-screen" >
            {/* Navigation & Title */}
            < div className="flex items-center justify-between mb-2" >
                <button onClick={() => navigate(-1)} className="flex items-center text-main hover:text-mainHover transition-colors bg-white px-4 py-1 rounded-lg shadow-sm">
                    <ArrowLeft size={18} className="mr-2" /> Back to List
                </button>
                <h1 className="text-xl font-bold text-gray-800">New Coupon Configuration</h1>
            </div >

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4">

                {/* Left Side: Basic Info & Logic */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-md font-bold mb-4 flex items-center text-main">
                            <Info size={18} className="mr-2" /> General Information
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Coupon Title*</label>
                                <input required name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-1 border rounded-lg focus:ring-2 focus:ring-main/50 text-sm outline-none" placeholder="Summer Flash Sale" />
                                {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title[0]}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Coupon Code* (Unique)</label>
                                <input required name="code" value={formData.code} onChange={handleChange} className="w-full px-4 py-1 border rounded-lg focus:ring-2 focus:ring-main/50 text-sm outline-none uppercase font-mono" placeholder="SUMMER20" />
                                {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code[0]}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} rows="3" className="w-full px-4 py-1 border rounded-lg focus:ring-2 focus:ring-main/50 text-sm outline-none" placeholder="Describe this offer..."></textarea>
                            </div>
                        </div>
                    </div>
                    {/* Searchable Multi-Select Sections */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border">
                        <h2 className="text-md font-bold mb-4 flex items-center text-orange-600"><Tag size={18} className="mr-2" /> Applicability (Searchable)</h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Product Search */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Select Products</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg text-xs outline-none focus:border-main"
                                        onChange={(e) => setSearchTerm({ ...searchTerm, product: e.target.value })}
                                    />
                                </div>
                                <div className="h-64 border rounded-lg overflow-y-auto bg-gray-50 p-2 space-y-1">
                                    {productList
                                        .filter(p => p.name.toLowerCase().includes(searchTerm.product.toLowerCase()))
                                        .map(prod => (
                                            <div
                                                key={prod.id}
                                                onClick={() => toggleSelection(prod.id, 'applicable_products')}
                                                className={`text-xs p-2 rounded cursor-pointer transition-colors ${formData.applicable_products.includes(prod.id) ? 'bg-main text-white' : 'bg-white hover:bg-blue-50 border'}`}
                                            >
                                                <img src={`${IMAGE_URL}/${prod.primary_image}`} className="w-4 h-4 inline-block mr-2 object-cover rounded"
                                                    alt={prod.name} /><span>{prod.name}</span>
                                            </div>
                                        ))}
                                </div>
                            </div>

                            {/* Category Search */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase">Select Categories</label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Search categories..."
                                        className="w-full pl-10 pr-4 py-2 border rounded-lg text-xs outline-none focus:border-main"
                                        onChange={(e) => setSearchTerm({ ...searchTerm, category: e.target.value })}
                                    />
                                </div>
                                <div className="h-64 border rounded-lg overflow-y-auto bg-gray-50 p-2 space-y-1">
                                    {categoryList
                                        .filter(c => c.name.toLowerCase().includes(searchTerm.category.toLowerCase()))
                                        .map(cat => (
                                            <div
                                                key={cat.id}
                                                onClick={() => toggleSelection(cat.id, 'applicable_categories')}
                                                className={`text-xs p-2 rounded cursor-pointer transition-colors ${formData.applicable_categories.includes(cat.id) ? 'bg-orange-500 text-white' : 'bg-white hover:bg-orange-50 border'}`}
                                            >
                                                <img src={`${IMAGE_URL}/${cat.image}`} className="w-4 h-4 inline-block mr-2 object-cover rounded"
                                                    alt={cat.name} /><span>{cat.name}</span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </div>

                        {/* Selected Badges */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {formData.applicable_products.length > 0 && <span className="text-[10px] bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">{formData.applicable_products.length} Products Selected</span>}
                            {formData.applicable_categories.length > 0 && <span className="text-[10px] bg-orange-100 text-orange-700 px-2 py-1 rounded-full font-bold">{formData.applicable_categories.length} Categories Selected</span>}
                        </div>
                    </div>

                </div>

                {/* Right Side: Limits & Dates */}
                <div className="space-y-4">
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-md font-bold mb-4 flex items-center text-main">
                            <Settings size={18} className="mr-2" /> Discount Rules
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Type*</label>
                                <select name="discount_type" value={formData.discount_type} onChange={handleChange} className="w-full px-4 py-1 border rounded-lg focus:ring-2 focus:ring-main/50 text-sm outline-none bg-white">
                                    <option value="percentage">Percentage (%)</option>
                                    <option value="fixed">Fixed Amount ($)</option>
                                    <option value="free_shipping">Free Shipping</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Value*</label>
                                <input type="number" required name="discount_value" value={formData.discount_value} onChange={handleChange} className="w-full px-4 py-1 border rounded-lg focus:ring-2 focus:ring-main/50 text-sm outline-none text-xs" placeholder="0.00" />
                                {errors.discount_value && <p className="text-red-500 text-xs mt-1">{errors.discount_value[0]}</p>}
                            </div>
                            {formData.discount_type === 'percentage' && (
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Max Discount Amount</label>
                                    <input type="number" name="max_discount_amount" value={formData.max_discount_amount} onChange={handleChange} className="w-full px-4 py-1 border rounded-lg focus:ring-2 focus:ring-main/50 text-sm outline-none" placeholder="Cap amount" />
                                </div>
                            )}
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Min. Order Amount</label>
                                <input type="number" name="minimum_amount" value={formData.minimum_amount} onChange={handleChange} className="w-full px-4 py-1 border rounded-lg focus:ring-2 focus:ring-main/50 text-sm outline-none" placeholder="0.00" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-md font-bold mb-4 flex items-center text-main">
                            <ShieldCheck size={18} className="mr-2" /> Usage & Limits
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Total Limit</label>
                                <input type="number" name="usage_limit_total" value={formData.usage_limit_total} onChange={handleChange} className="w-full px-4 py-1 border rounded-lg focus:ring-2 focus:ring-main/50 text-sm outline-none" placeholder="Unlimited" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Limit Per User</label>
                                <input type="number" name="usage_limit_per_user" value={formData.usage_limit_per_user} onChange={handleChange} className="w-full px-4 py-1 border rounded-lg focus:ring-2 focus:ring-main/50 text-sm outline-none" />
                            </div>
                            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                                <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-5 h-5 text-main rounded focus:ring-blue-400" />
                                <label className="ml-3 text-xs font-bold text-blue-800">Active Status</label>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-md font-bold mb-4 flex items-center text-main">
                            <Calendar size={18} className="mr-2" /> Validity Period
                        </h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Starts At</label>
                                <input type="datetime-local" name="starts_at" value={formData.starts_at} onChange={handleChange} className="w-full px-4 py-1 border rounded-lg outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Ends At</label>
                                <input type="datetime-local" name="ends_at" value={formData.ends_at} onChange={handleChange} className="w-full px-4 py-1 border rounded-lg outline-none" />
                                {errors.ends_at && <p className="text-red-500 text-xs mt-1">{errors.ends_at[0]}</p>}
                            </div>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} className="w-full bg-main hover:bg-mainHover text-white py-2 rounded-2xl font-bold shadow-lg transition-all flex justify-center items-center">
                        {loading ? "Processing..." : <><Save size={20} className="mr-2" /> Create Coupon</>}
                    </button>
                </div>
            </form>
        </div >
    );
};

export default CreateCoupon;