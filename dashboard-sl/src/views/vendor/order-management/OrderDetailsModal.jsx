import React from "react";
import { User, MapPin, X } from "lucide-react";
import { format } from "date-fns";

const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;
    // console.log(order);
    const { parsedData, items, unid, subtotal, vendor_earning, order: orderInfo } = order;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[90] animate-fadeIn">
            {/* Scrollable Modal Container */}
            <div className="bg-white rounded-lg shadow-xl max-w-3xl w-[95%] p-5 relative overflow-auto max-h-[90vh]">
                {/* Sticky Header */}
                <div className="bg-white border-b border-gray-200 px-2 py-2 flex justify-between items-center z-10 rounded-t-2xl">
                    <h2 className="text-lg font-bold text-gray-800">
                        Order Details - {unid}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-main hover:text-mainHover transition font-light fixed left-auto right-4 top-4"
                        aria-label="Close modal"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="px-2 md:p-2 space-y-4">
                    {/* Customer & Shipping Info */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Customer Info */}
                        <div className="bg-gray-50 rounded-xl p-2">
                            <h3 className="font-bold text-md mb-4 flex items-center gap-2 text-gray-800">
                                <User className="w-5 h-5" /> Customer Information
                            </h3>
                            <div className="space-y-2 text-gray-700 text-sm">
                                <p className="flex justify-between">
                                    <span className="font-medium">Name:</span>
                                    <span>{parsedData?.billing?.fullName || "—"}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="font-medium">Phone:</span>
                                    <span>{parsedData?.billing?.phone || "—"}</span>
                                </p>
                                <p className="flex justify-between">
                                    <span className="font-medium">Email:</span>
                                    <span>{parsedData?.billing?.email || "—"}</span>
                                </p>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-gray-50 rounded-xl p-2">
                            <h3 className="font-bold text-md mb-4 flex items-center gap-2 text-gray-800">
                                <MapPin className="w-5 h-5" /> Shipping Address
                            </h3>
                            <p className="text-gray-700 leading-relaxed text-sm">
                                {[
                                    parsedData?.billing?.line1,
                                    parsedData?.billing?.line2,
                                    parsedData?.billing?.city,
                                    parsedData?.billing?.state,
                                    parsedData?.billing?.postalCode,
                                    parsedData?.billing?.country,
                                ]
                                    .filter(Boolean)
                                    .join(", ") || "—"}
                            </p>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="px-2">
                        <h3 className="font-bold text-md mb-2 text-gray-800">Order Summary</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="bg-white rounded-xl p-3 text-center shadow">
                                <p className="text-gray-600 text-sm">Subtotal</p>
                                <p className="text-xl font-bold text-gray-800 mt-1">
                                    ৳ {Number(subtotal).toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-white rounded-xl p-3 text-center shadow">
                                <p className="text-gray-600 text-sm">Shipping</p>
                                <p className="text-xl font-bold text-gray-800 mt-1">
                                    ৳ {orderInfo?.shipping || 0}
                                </p>
                            </div>
                            <div className="bg-white rounded-xl p-3 text-center shadow">
                                <p className="text-gray-600 text-sm">Your Earning</p>
                                <p className="text-xl font-bold text-green-600 mt-1">
                                    ৳ {Number(vendor_earning).toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center shadow">
                                <p className="text-gray-600 text-sm">Grand Total</p>
                                <p className="text-2xl font-bold text-blue-600 mt-1">
                                    ৳ {Number(orderInfo?.total_amount || subtotal).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Ordered Items */}
                    <div className="px-2">
                        <h3 className="font-bold text-md mb-2 text-gray-800">Ordered Items</h3>
                        <div className="space-y-4">
                            {items.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="bg-gray-50 rounded-xl p-2 flex flex-col md:flex-row gap-6 border"
                                >
                                    <img
                                        src={
                                            item.image?.image_path
                                                ? `${import.meta.env.VITE_IMAGE_URL}/${item.image.image_path}`
                                                : "/placeholder.png"
                                        }
                                        alt={item.product.name}
                                        className="w-full md:w-20 md:h-20 object-cover rounded-lg shadow-sm border"
                                    />

                                    <div className="flex space-y-2 justify-between w-full md:items-center md:flex-row flex-col">
                                        <div>
                                            <h4 className="font-bold text-sm text-gray-900">
                                                {item.product.name}
                                            </h4>
                                            <p className="text-xs text-gray-600">SKU: {item.variant.sku}</p>

                                            {item.variant.attributes && (
                                                <p className="text-xs text-gray-500 bg-white rounded-full inline-block">
                                                    {Object.values(JSON.parse(item.variant.attributes)).join(" • ")}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex-col sm:flex-row sm:justify-between sm:items-end gap-3">
                                            <div className="text-xl font-bold text-blue-600">
                                                ৳ {Number(item.total).toLocaleString()}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Qty: <span className="font-bold">{item.quantity}</span> × ৳{" "}
                                                {Number(item.price).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default OrderDetailsModal;