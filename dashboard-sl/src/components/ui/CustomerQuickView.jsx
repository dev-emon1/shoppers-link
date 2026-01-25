import { X, MapPin, Phone, Mail, ShoppingBag } from "lucide-react";
import { IMAGE_URL } from "../../utils/api";

const CustomerQuickView = ({ customer, onClose }) => {
    if (!customer) return null;

    // মোট কত টাকার অর্ডার করেছে তা ক্যালকুলেট করা
    const totalSpent = customer.orders?.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0) || 0;

    // ডিফল্ট অ্যাড্রেস খুঁজে বের করা
    const defaultAddress = customer.shipping_addresses?.find(addr => addr.is_default === 1) || customer.shipping_addresses?.[0];

    return (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200">

                {/* Header */}
                <div className="flex justify-between items-center p-5 border-b bg-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Customer Profile</h2>
                        <p className="text-xs text-gray-500">ID: #CUST-{customer.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                {/* Body Content (Scrollable) */}
                <div className="p-6 overflow-y-auto custom-scrollbar">

                    {/* Top Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Profile Info */}
                        <div className="flex flex-col items-center md:items-start space-y-3">
                            <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-orange-50 text-orange-600 text-3xl font-black border-2 border-orange-200 shadow-inner overflow-hidden uppercase">
                                <img
                                    src={customer.profile_picture
                                        ? `${IMAGE_URL}avatars/${customer.profile_picture}`
                                        : `https://ui-avatars.com/api/?name=${customer.full_name}&background=ffedd5&color=fb923c&bold=true`
                                    }
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.src = `https://ui-avatars.com/api/?name=${customer.full_name}&background=ffedd5&color=fb923c`;
                                    }}
                                />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 text-center md:text-left uppercase">{customer.full_name}</h3>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                    <Phone size={14} className="text-orange-500" />
                                    <span>{customer.contact_number}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                    <Mail size={14} className="text-orange-500" />
                                    <span>{customer.user?.email || "N/A"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats Card */}
                        <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100 flex flex-col justify-center items-center text-center">
                            <p className="text-[11px] font-bold text-orange-400 uppercase tracking-widest mb-1">Total Spent</p>
                            <p className="text-2xl font-black text-orange-600">৳ {totalSpent.toLocaleString()}</p>
                            <p className="text-xs text-orange-400 mt-2 font-medium">{customer.orders?.length || 0} Successful Orders</p>
                        </div>

                        {/* Default Address */}
                        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
                            <div className="flex items-center gap-2 mb-2 text-gray-400">
                                <MapPin size={16} />
                                <span className="text-[11px] font-bold uppercase tracking-wider">Default Address</span>
                            </div>
                            {defaultAddress ? (
                                <p className="text-sm text-gray-600 leading-relaxed">
                                    {defaultAddress.address_line1}, <br />
                                    {defaultAddress.city} {defaultAddress.country}
                                </p>
                            ) : (
                                <p className="text-sm text-gray-400 italic">No address saved</p>
                            )}
                        </div>
                    </div>

                    {/* Order History Table */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <ShoppingBag size={18} className="text-gray-700" />
                            <h4 className="font-bold text-gray-700">Recent Orders</h4>
                        </div>
                        <div className="border rounded-xl overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500 font-medium">
                                    <tr>
                                        <th className="px-4 py-3">Order ID</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Amount</th>
                                        <th className="px-4 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {customer.orders?.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 transition">
                                            <td className="px-4 py-3 font-mono text-xs text-orange-600 font-bold">{order.unid}</td>
                                            <td className="px-4 py-3 text-gray-600">
                                                {new Date(order.created_at).toLocaleDateString('en-GB')}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-gray-800">৳ {parseFloat(order.total_amount).toLocaleString()}</td>
                                            <td className="px-4 py-3">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {(!customer.orders || customer.orders.length === 0) && (
                                        <tr>
                                            <td colSpan="4" className="px-4 py-8 text-center text-gray-400 italic">No orders found for this customer.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-50 transition shadow-sm"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CustomerQuickView;