import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Save, ArrowLeft, Info, X } from 'lucide-react';
import API from '../../../utils/api';
import { toast } from 'react-toastify';

const EditShippingCharge = () => {
    const { id } = useParams(); // URL থেকে ID পাওয়ার জন্য
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        type: 'flat',
        min_weight: '',
        max_weight: '',
        min_quantity: '',
        max_quantity: '',
        min_amount: '',
        max_amount: '',
        charge: 0,
        extra_charge: '',
        free_above: '',
        areas: [],
        is_countrywide: false,
        is_active: true,
        sort_order: 0
    });

    const [areaInput, setAreaInput] = useState('');

    // বিদ্যমান ডাটা ফেচ করার জন্য useEffect
    useEffect(() => {
        const fetchShippingDetail = async () => {
            try {
                const response = await API.get(`/shipping-charges/${id}`);
                const data = response.data.data || response.data; // API structure অনুযায়ী

                // Form state আপডেট করা
                setFormData({
                    ...data,
                    // null ভ্যালু থাকলে সেগুলোকে empty string করে দেওয়া যাতে ইনপুট এরর না দেয়
                    extra_charge: data.extra_charge ?? '',
                    free_above: data.free_above ?? '',
                    min_weight: data.min_weight ?? '',
                    max_weight: data.max_weight ?? '',
                    min_quantity: data.min_quantity ?? '',
                    max_quantity: data.max_quantity ?? '',
                    min_amount: data.min_amount ?? '',
                    max_amount: data.max_amount ?? '',
                    areas: data.areas ?? []
                });
            } catch (err) {
                toast.error("Failed to load shipping data");
                navigate(-1);
            } finally {
                setFetching(false);
            }
        };

        fetchShippingDetail();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        if (name === 'name') {
            setFormData(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            }));
        }
    };

    const addArea = () => {
        if (areaInput.trim() && !formData.areas.includes(areaInput.trim())) {
            setFormData(prev => ({
                ...prev,
                areas: [...prev.areas, areaInput.trim()]
            }));
            setAreaInput('');
        }
    };

    const removeArea = (index) => {
        setFormData(prev => ({
            ...prev,
            areas: prev.areas.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // ডাটা আপডেট করার জন্য PUT রিকোয়েস্ট
            await API.put(`/shipping-charges/${id}`, formData);
            toast.success("Shipping charge updated successfully!");
            navigate('/admin/shipping/charges');
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Update failed";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return <div className="flex justify-center items-center h-64 text-gray-500 font-bold uppercase tracking-widest">Loading Data...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-6 mb-4">
            <div className="flex items-center justify-between mb-4">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold transition-all">
                    <ArrowLeft size={20} /> Back
                </button>
                <h1 className="text-xl text-gray-900 uppercase">Edit Shipping Method</h1>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6 max-w-5xl mx-auto px-2 md:px-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-gray-100">

                    {/* Basic Info */}
                    <div className="col-span-1 md:col-span-2 lg:col-span-1">
                        <label className="block text-[10px] md:text-xs tracking-widest mb-2 uppercase font-semibold text-gray-500">Method Name</label>
                        <input
                            required
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-main outline-none text-sm transition-all"
                        />
                    </div>

                    <div className="col-span-1 md:col-span-2 lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] md:text-xs tracking-widest mb-2 uppercase font-semibold text-gray-500">Slug</label>
                            <input
                                required
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-main outline-none text-sm bg-gray-50/50"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] md:text-xs tracking-widest mb-2 uppercase font-semibold text-gray-500">Calculation Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-main outline-none text-sm cursor-pointer"
                            >
                                <option value="flat">Flat Rate</option>
                                <option value="weight">By Weight</option>
                                <option value="quantity">By Quantity</option>
                                <option value="amount">By Order Amount</option>
                            </select>
                        </div>
                    </div>

                    {/* Pricing & Conditions */}
                    <div className="col-span-1 md:col-span-2 border-y border-gray-50 py-4">
                        <div className="flex items-center gap-2 mb-4 text-main font-bold italic text-sm md:text-base">
                            <Info size={18} /> Pricing & Conditions
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            {formData.type === 'weight' && (
                                <>
                                    <input type="number" step="0.01" name="min_weight" value={formData.min_weight} placeholder="Min Weight (kg)" onChange={handleChange} className="w-full px-5 py-2 border border-gray-200 rounded-xl outline-none text-sm focus:border-main" />
                                    <input type="number" step="0.01" name="max_weight" value={formData.max_weight} placeholder="Max Weight (kg)" onChange={handleChange} className="w-full px-5 py-2 border border-gray-200 rounded-xl outline-none text-sm focus:border-main" />
                                </>
                            )}
                            {formData.type === 'quantity' && (
                                <>
                                    <input type="number" name="min_quantity" value={formData.min_quantity} placeholder="Min Quantity" onChange={handleChange} className="w-full px-5 py-2 border border-gray-200 rounded-xl outline-none text-sm focus:border-main" />
                                    <input type="number" name="max_quantity" value={formData.max_quantity} placeholder="Max Quantity" onChange={handleChange} className="w-full px-5 py-2 border border-gray-200 rounded-xl outline-none text-sm focus:border-main" />
                                </>
                            )}
                            {formData.type === 'amount' && (
                                <>
                                    <input type="number" name="min_amount" value={formData.min_amount} placeholder="Min Order Amount" onChange={handleChange} className="w-full px-5 py-2 border border-gray-200 rounded-xl outline-none text-sm focus:border-main" />
                                    <input type="number" name="max_amount" value={formData.max_amount} placeholder="Max Order Amount" onChange={handleChange} className="w-full px-5 py-2 border border-gray-200 rounded-xl outline-none text-sm focus:border-main" />
                                </>
                            )}

                            <div className="col-span-1 sm:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-tighter ml-1">Charge Amount (৳)</label>
                                    <input type="number" required name="charge" value={formData.charge} onChange={handleChange} className="w-full px-5 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-main outline-none text-sm font-bold text-main" />
                                </div>
                                {/* <div className="space-y-1">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-tighter ml-1">Extra Charge (৳)</label>
                                    <input type="number" step="0.01" name="extra_charge" value={formData.extra_charge} onChange={handleChange} className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-main outline-none text-sm" placeholder="Handling Fee" />
                                </div> */}
                                <div className="space-y-1">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-tighter ml-1">Free Above (৳)</label>
                                    <input type="number" name="free_above" value={formData.free_above} onChange={handleChange} className="w-full px-5 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-main outline-none text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Geography */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                            <label className="text-xs font-semibold tracking-widest uppercase text-gray-500">Coverage Areas</label>
                            <label className="flex items-center gap-2 cursor-pointer bg-blue-50/50 px-3 py-1.5 rounded-lg border border-blue-100">
                                <input type="checkbox" name="is_countrywide" checked={formData.is_countrywide} onChange={handleChange} className="w-4 h-4 accent-main" />
                                <span className="text-sm font-bold text-gray-700">Whole Country</span>
                            </label>
                        </div>

                        {!formData.is_countrywide && (
                            <div className="space-y-4">
                                <div className="flex flex-col sm:flex-row gap-2">
                                    <input
                                        value={areaInput}
                                        onChange={(e) => setAreaInput(e.target.value)}
                                        placeholder="Add City"
                                        className="flex-1 px-5 py-2 border border-gray-200 rounded-xl outline-none text-sm focus:border-main"
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addArea())}
                                    />
                                    <button type="button" onClick={addArea} className="px-6 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm">Update Areas</button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {formData.areas.map((area, index) => (
                                        <span key={index} className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg text-xs font-bold text-gray-600">
                                            {area}
                                            <button type="button" onClick={() => removeArea(index)} className="text-gray-400 hover:text-red-500">
                                                <X size={14} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Settings */}
                    <div className="col-span-1 md:col-span-2 flex items-center justify-between gap-4 border-t border-gray-50 pt-4">
                        <label className="flex items-center gap-2 cursor-pointer bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                            <input type="checkbox" name="is_active" checked={formData.is_active} onChange={handleChange} className="w-4 h-4 accent-main" />
                            <span className="text-sm font-bold text-gray-700">Active Status</span>
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gray-400 uppercase">Sort Order:</span>
                            <input type="number" name="sort_order" value={formData.sort_order} onChange={handleChange} className="w-16 px-2 py-1.5 bg-gray-50 border border-gray-200 rounded-lg outline-none font-bold text-center" />
                        </div>
                    </div>
                </div>

                <div className="flex justify-center md:justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 bg-main text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-blue-100 hover:translate-y-[-2px] transition-all disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : <><Save size={20} /> Update Method</>}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditShippingCharge;