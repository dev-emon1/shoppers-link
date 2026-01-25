import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Search, MapPin, Truck, Scale, Box, DollarSign, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import API from '../../../utils/api';
import { toast } from 'react-toastify';
import { TbCurrencyTaka } from 'react-icons/tb';

const ShippingCharge = () => {
    const [charges, setCharges] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const fetchCharges = async (page = 1, search = "") => {
        setLoading(true);
        try {
            const response = await API.get(`/shipping-charges?page=${page}&search=${search}`);
            setCharges(response.data.data || []);
            setMeta(response.data.meta);
            setLoading(false);
        } catch (err) {
            toast.error("Shipping charges could not be loaded.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCharges(currentPage, searchTerm);
    }, [currentPage]);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchCharges(1, searchTerm);
    };

    // Type অনুযায়ী Icon এবং Color নির্ধারণ
    const getTypeDetails = (type) => {
        switch (type) {
            case 'weight': return { icon: <Scale size={14} />, color: 'text-purple-600 bg-purple-50', label: 'By Weight' };
            case 'quantity': return { icon: <Box size={14} />, color: 'text-orange-600 bg-orange-50', label: 'By Qty' };
            case 'amount': return { icon: <TbCurrencyTaka size={14} />, color: 'text-green-600 bg-green-50', label: 'By Order Value' };
            default: return { icon: <Truck size={14} />, color: 'text-blue-600 bg-blue-50', label: 'Flat Rate' };
        }
    };

    if (loading) return <div className="text-center py-20 italic text-gray-500 font-bold">Loading Shipping Methods...</div>;

    return (
        <div className="max-w-7xl mx-auto px-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4 bg-white p-4 rounded-3xl shadow-sm border border-gray-100">
                <div>
                    <h1 className="text-xl font-bold text-gray-900 uppercase tracking-tight">Shipping Charges</h1>
                    <p className="text-gray-500 text-sm">Set delivery rates based on location, weight, or order value.</p>
                </div>

                <div className="flex items-center gap-3">
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            placeholder="Search methods..."
                            className="pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-main outline-none w-64"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute left-3 top-3 text-gray-400" size={18} />
                    </form>
                    <Link to="/admin/shipping/charges/add" className="flex items-center gap-2 bg-main text-white px-4 py-2 rounded-2xl  hover:shadow-lg transition-all text-sm">
                        <Plus size={20} /> Add New
                    </Link>
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {charges.map((item) => {
                    const typeInfo = getTypeDetails(item.type);
                    return (
                        <div key={item.id} className="bg-white border border-gray-100 rounded-[2rem] p-6 shadow-sm hover:shadow-xl transition-all relative flex flex-col justify-between overflow-hidden">

                            {/* Top Badge & Active Status */}
                            <div className="flex justify-between items-start mb-4">
                                <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${typeInfo.color}`}>
                                    {typeInfo.icon} {typeInfo.label}
                                </div>
                                <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${item.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                    {item.is_active ? 'ACTIVE' : 'DISABLED'}
                                </span>
                            </div>

                            {/* Name & Pricing */}
                            <div className="mb-4">
                                <h3 className="text-xl font-bold text-gray-800 leading-tight mb-1">{item.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl font-bold text-main">৳{parseFloat(item.charge)}</span>
                                    {item.free_above && (
                                        <span className="text-[10px] font-bold text-green-500 italic">Free above ৳{parseFloat(item.free_above)}</span>
                                    )}
                                </div>
                            </div>

                            {/* Conditions Box */}
                            <div className="bg-gray-50 rounded-2xl p-4 mb-5 border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase mb-2 tracking-widest">Pricing Conditions</p>
                                <div className="space-y-2">
                                    {item.type === 'weight' && (
                                        <div className="flex justify-between text-sm font-bold text-gray-600">
                                            <span>Weight Range:</span>
                                            <span>{item.min_weight ?? 0}kg - {item.max_weight ?? '∞'}kg</span>
                                        </div>
                                    )}
                                    {item.type === 'quantity' && (
                                        <div className="flex justify-between text-sm font-bold text-gray-600">
                                            <span>Quantity:</span>
                                            <span>{item.min_quantity ?? 0} - {item.max_quantity ?? '∞'} pcs</span>
                                        </div>
                                    )}
                                    {item.type === 'amount' && (
                                        <div className="flex justify-between text-sm font-bold text-gray-600">
                                            <span>Order Total:</span>
                                            <span>৳{item.min_amount ?? 0} - ৳{item.max_amount ?? '∞'}</span>
                                        </div>
                                    )}
                                    {item.type === 'flat' && (
                                        <div className="text-sm font-bold text-gray-500 italic flex items-center gap-1">
                                            <Info size={14} /> No extra conditions applied.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Areas / Location */}
                            <div className="flex items-start gap-2 mb-6">
                                <MapPin size={16} className="text-gray-400 mt-1 shrink-0" />
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Coverage</p>
                                    <p className="text-xs font-bold text-gray-700">
                                        {item.is_countrywide ? "Countrywide Delivery" : (
                                            item.areas ? item.areas.join(", ") : "Not specified"
                                        )}
                                    </p>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <span className="text-[10px] font-bold text-gray-400">Sort Order: {item.sort_order}</span>
                                <Link to={`/admin/shipping-charges/edit/${item.id}`} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-main hover:text-white transition-all">
                                    <Edit size={16} />
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Pagination */}
            {
                meta && meta.last_page > 1 && (
                    <div className="mt-12 flex justify-center items-center gap-4">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="p-3 rounded-2xl border bg-white disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="bg-white px-6 py-2 rounded-2xl border font-bold text-gray-600 shadow-sm">
                            {meta.current_page} / {meta.last_page}
                        </div>
                        <button
                            disabled={currentPage === meta.last_page}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="p-3 rounded-2xl border bg-white disabled:opacity-30 hover:bg-gray-50 transition-all shadow-sm"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )
            }
        </div >
    );
};

export default ShippingCharge;