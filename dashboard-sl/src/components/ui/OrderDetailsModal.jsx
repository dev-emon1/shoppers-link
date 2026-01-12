// src/components/modals/OrderDetailsModal.jsx
import React from "react";
import { X, User, Phone, MapPin, Package, CreditCard, Calendar, Tag } from "lucide-react";
import { format } from "date-fns";

const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;
    // console.log(order);

    // Parse a_s_a safely
    let billing = {};
    let shipping = {};
    try {
        if (order.a_s_a) {
            const parsed = typeof order.a_s_a === "string" ? JSON.parse(order.a_s_a) : order.a_s_a;
            billing = parsed.billing || {};
            shipping = parsed.shipping || "inside";
        }
    } catch (e) {
        console.warn("Failed to parse a_s_a:", e);
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[90] flex items-center justify-center p-4 overflow-y-auto ">
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-[95%] p-5 relative overflow-auto max-h-[90vh]">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">Order Details:</h2>
                        <p className="text-lg text-main font-bold mt-1">{order.unid}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl font-bold transition"
                    >
                        ×
                    </button>
                </div>

                <div className="p-4 space-y-2">
                    {/* Customer & Shipping Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Customer Info */}
                        <div className="bg-gray-50 rounded-xl p-2">
                            <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-gray-800">
                                <User className="w-5 h-5" /> Customer Information
                            </h3>
                            <div className="space-y-2 text-gray-700 text-sm">
                                <p className="flex justify-between">
                                    <span className="font-medium">Name:</span>
                                    <span>{billing?.fullName || "—"}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="font-medium">Phone:</span>
                                    <span>{billing?.phone || "—"}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="font-medium">Email:</span>
                                    <span>{billing?.email || "—"}</span>
                                </p>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-gray-50 rounded-xl p-2">
                            <h3 className="font-bold text-sm mb-4 flex items-center gap-2 text-gray-800">
                                <MapPin className="w-5 h-5" /> Shipping Address
                            </h3>
                            <p className="text-gray-700 leading-relaxed text-sm">
                                {[
                                    billing?.line1,
                                    billing?.area,
                                    billing?.city,
                                    billing?.state,
                                    billing?.postalCode,
                                    billing?.country,
                                ]
                                    .filter(Boolean)
                                    .join(", ") || "—"}
                            </p>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-2">
                        <h3 className="font-bold text-sm mb-2 text-green-800">Order Summary</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white rounded-xl p-4 text-center shadow">
                                <p className="text-sm text-gray-600">Items</p>
                                <p className="text-sm font-bold text-green-700">{order.total_item}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center shadow">
                                <p className="text-sm text-gray-600">Payment</p>
                                <p className="text-sm font-bold uppercase">{order.payment_method || "COD"}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center shadow">
                                <p className="text-sm text-gray-600">Date</p>
                                <p className="text-sm font-bold">{format(new Date(order.created_at), "dd MMM yyyy")}</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center shadow">
                                <p className="text-sm text-gray-600 mt-2">Grand Total</p>
                                <div className="text-sm font-bold text-green-600">
                                    ৳ {Number(order.total_amount).toLocaleString()}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Ordered Items */}
                    <div>
                        <h3 className="font-bold text-sm mb-2 text-gray-800">Ordered Items</h3>
                        <div className="space-y-2">
                            {order.vendor_orders?.map((vo) =>
                                vo.items?.map((item, idx) => {
                                    const product = item.product || {};
                                    const variant = item.variant || {};

                                    return (
                                        <div key={idx} className="rounded-2xl p-2 flex flex-col md:flex-row gap-4 border border-gray-200">
                                            {/* Product Image */}
                                            <div className="w-full md:w-12 h-12 rounded-xl border-2 border-dashed flex items-center justify-center">
                                                <Package className="w-12 h-12 text-gray-400" />
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 space-y-1">
                                                <h4 className="text-sm font-bold text-gray-900">{product.name || "Unknown Product"}</h4>
                                                <p className="text-gray-600 text-xs">SKU: <span className="font-mono">{product.sku || "—"}</span></p>

                                                {/* Variant Attributes */}
                                                {variant.attributes && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {Object.entries(JSON.parse(variant.attributes)).map(([key, val]) => (
                                                            <span key={key} className="px-3 py-1 bg-main/10 text-main rounded-full text-sm font-medium">
                                                                {key}: {val}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Price & Quantity */}
                                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2 border-t">
                                                    <div className="text-sm font-bold text-green-600">
                                                        ৳ {Number(item.total).toLocaleString()}
                                                    </div>
                                                    <div className="text-gray-700">
                                                        Quantity: <span className="font-bold text-sm">{item.quantity}</span> × ৳ {Number(item.price).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;