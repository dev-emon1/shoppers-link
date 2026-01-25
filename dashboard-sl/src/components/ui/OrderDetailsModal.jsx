import React from "react";
import { X, User, Phone, Mail, MapPin, Package, CreditCard, Calendar, DollarSign } from "lucide-react";
import { format } from "date-fns";

const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    // Get the first vendor order (most common case in your data)
    const mainVendorOrder = order.vendor_orders?.[0] || {};

    // Parse billing & shipping info
    let billing = {};
    let shippingType = "inside";
    let totals = {};

    try {
        const asaStr = mainVendorOrder.order?.a_s_a;
        if (asaStr) {
            const parsed = typeof asaStr === "string" ? JSON.parse(asaStr) : asaStr;
            billing = parsed?.billing || {};
            shippingType = parsed?.shipping || "inside";
            totals = parsed?.totals || {};
        }
    } catch (err) {
        console.warn("Failed to parse a_s_a:", err);
    }

    // Calculate total items
    const totalItems = order.vendor_orders?.reduce((sum, vo) => sum + (vo.item_count || 0), 0) || 0;

    // Grand total – prefer totals.grandTotal if available, fallback to order.total_amount
    const displayGrandTotal = totals.grandTotal || order.total_amount || 0;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white border-b px-6 py-2 flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                        <p className="text-lg font-mono text-main mt-1">{order.unid}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-gray-100 transition"
                    >
                        <X className="w-6 h-6 text-gray-600" />
                    </button>
                </div>

                <div className="p-4 space-y-2">
                    {/* Customer + Address Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                        {/* Customer Info */}
                        <div className="bg-gray-50/70 rounded-xl p-2 border border-gray-100">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                                <User className="w-5 h-5" /> Customer
                            </h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Name</span>
                                    <span className="font-medium">
                                        {billing.fullName || order.customer?.full_name || "—"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Phone</span>
                                    <span className="font-medium">
                                        {billing.phone || order.customer?.contact_number || "—"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Email</span>
                                    <span className="font-medium">
                                        {billing.email || order.customer?.user?.email || "—"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-gray-50/70 rounded-xl p-2 border border-gray-100">
                            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                                <MapPin className="w-5 h-5" /> Shipping Address
                            </h3>
                            <div className="text-sm text-gray-700 leading-relaxed">
                                {billing.line1 && <p>{billing.line1}</p>}
                                {(billing.area || billing.city) && (
                                    <p>
                                        {billing.area && `${billing.area}, `}
                                        {billing.city}
                                        {billing.postalCode && ` - ${billing.postalCode}`}
                                    </p>
                                )}
                                {billing.notes && (
                                    <p className="mt-2 text-gray-500 italic">
                                        Note: {billing.notes}
                                    </p>
                                )}
                                {!billing.line1 && !billing.city && <p className="text-gray-500">— No address provided —</p>}
                            </div>
                            <p className="mt-3 text-xs text-gray-500">
                                Shipping: <span className="font-medium">{shippingType}</span>
                            </p>
                        </div>
                    </div>

                    {/* Order Summary Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
                            <p className="text-xs text-gray-500 uppercase">Items</p>
                            <p className="text-xl font-bold text-indigo-600 mt-1">{totalItems}</p>
                        </div>
                        <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
                            <p className="text-xs text-gray-500 uppercase">Payment</p>
                            <p className="text-xl font-bold uppercase mt-1">
                                {order.payment_method?.toUpperCase() || "COD"}
                            </p>
                            {/* <p className="text-xs text-gray-500 mt-1">
                                {order.payment_status?.toUpperCase()}
                            </p> */}
                        </div>
                        <div className="bg-white border rounded-xl p-4 text-center shadow-sm">
                            <p className="text-xs text-gray-500 uppercase">Order Date</p>
                            <p className="text-xl font-medium mt-1">
                                {format(new Date(order.created_at), "dd MMM yyyy")}
                            </p>
                        </div>
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-xl p-4 text-center shadow-sm">
                            <p className="text-xs text-green-700 uppercase">Grand Total</p>
                            <p className="text-2xl font-bold text-green-700 mt-1">
                                ৳ {Number(displayGrandTotal).toLocaleString()}
                            </p>
                        </div>
                    </div>

                    {/* Ordered Items */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-800">
                            <Package className="w-5 h-5" /> Ordered Items
                        </h3>

                        {order.vendor_orders?.length > 0 ? (
                            order.vendor_orders.map((vo, voIndex) => (
                                <div key={vo.id} className="mb-6">
                                    {order.vendor_orders.length > 1 && (
                                        <p className="text-sm font-medium text-gray-600 mb-2">
                                            Vendor Order #{voIndex + 1} • {vo.unid}
                                        </p>
                                    )}

                                    <div className="space-y-4">
                                        {vo.items?.map((item) => {
                                            const product = item.product || {};
                                            const variant = item.variant || {};
                                            let attributes = {};
                                            try {
                                                attributes = variant.attributes
                                                    ? JSON.parse(variant.attributes)
                                                    : {};
                                            } catch { }

                                            return (
                                                <div
                                                    key={item.id}
                                                    className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-xl border hover:border-indigo-200 transition"
                                                >
                                                    {/* Image placeholder / real image */}
                                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                        {product.primary_image ? (
                                                            <img
                                                                // src={`/${product.primary_image}`} // ← adjust base path if needed
                                                                src={
                                                                    product.primary_image
                                                                        ? `${import.meta.env.VITE_IMAGE_URL}/${product.primary_image}`
                                                                        : "/placeholder.png"
                                                                }
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => (e.target.src = "/placeholder.jpg")}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <Package size={32} />
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Details */}
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-900">
                                                            {product.name || "Product"}
                                                        </h4>
                                                        <p className="text-sm text-gray-500 mt-0.5">
                                                            SKU: {product.sku || variant.sku || "—"}
                                                        </p>

                                                        {/* Variants */}
                                                        {Object.keys(attributes).length > 0 && (
                                                            <div className="flex flex-wrap gap-2 mt-2">
                                                                {Object.entries(attributes).map(([key, value]) => (
                                                                    <span
                                                                        key={key}
                                                                        className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-medium"
                                                                    >
                                                                        {key}: {value}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        )}

                                                        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
                                                            <div className="font-bold text-green-700">
                                                                ৳ {Number(item.total || item.price * item.quantity).toLocaleString()}
                                                            </div>
                                                            <div className="text-gray-600">
                                                                Qty: <span className="font-semibold">{item.quantity}</span> ×
                                                                ৳ {Number(item.price).toLocaleString()}
                                                            </div>
                                                            {item.status && (
                                                                <span className="px-2.5 py-0.5 bg-red-100 text-red-700 rounded-full text-xs">
                                                                    {item.status}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-gray-500">
                                No items found in this order
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;