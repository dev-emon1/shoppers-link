import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, Home, XCircle } from 'lucide-react';

const OrderTrackingPage = () => {
    const [trackingId, setTrackingId] = useState('');
    const [orderFound, setOrderFound] = useState(false);

    const demoOrder = {
        orderId: "#ORD8921",
        trackingId: "PATH-784512-DHK",
        customer: "Fatema Akter",
        phone: "01711-234567",
        address: "House 12, Road 5, Mirpur-10, Dhaka-1216",
        paymentMethod: "bKash",
        total: "৳ 8,500",
        orderDate: "November 19, 2025",
        estimatedDelivery: "November 22 – 24, 2025",
        courier: "Pathao Delivery",
        status: "In Transit",
        timeline: [
            { status: "Order Placed", date: "Nov 19, 2025, 2:30 PM", completed: true, icon: Package },
            { status: "Payment Confirmed", date: "Nov 19, 2025, 2:35 PM", completed: true, icon: CheckCircle },
            { status: "Processing at Warehouse", date: "Nov 19, 2025, 4:15 PM", completed: true, icon: Package },
            { status: "Picked Up by Courier", date: "Nov 20, 2025, 10:00 AM", completed: true, icon: Truck },
            { status: "In Transit", date: "Nov 20, 2025, 11:30 AM", completed: true, icon: Truck },
            { status: "Out for Delivery", date: "Expected Today", completed: false, icon: Truck },
            { status: "Delivered", date: "Pending", completed: false, icon: Home },
        ],
        products: [
            { name: "Cotton Panjabi for Men - White", qty: 2, price: "৳ 2,850 each" },
            { name: "Leather Nagra Sandals (Size 42)", qty: 1, price: "৳ 1,990" },
        ]
    };

    const handleTrack = (e) => {
        e.preventDefault();
        if (trackingId.trim() === "PATH-784512-DHK" || trackingId.trim() === "ORD8921") {
            setOrderFound(true);
        } else {
            alert("Order not found. Try: PATH-784512-DHK or ORD8921");
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered": return "bg-green-100 text-green-800";
            case "In Transit": case "Out for Delivery": return "bg-blue-100 text-blue-800";
            case "Processing": return "bg-yellow-100 text-yellow-800";
            case "Cancelled": return "bg-red-100 text-red-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="min-h-screen py-2 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-bold bg-main bg-clip-text text-transparent mb-3">
                        Track Your Order
                    </h1>
                    <p className="text-gray-600 text-lg">See real-time updates of your delivery</p>
                </div>

                {/* Search Box */}
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-4 mb-4 border border-white/50">
                    <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-5 top-3 text-main" size={24} />
                            <input
                                type="text"
                                placeholder="Enter Order ID or Tracking Number..."
                                className="w-full pl-14 pr-6 py-2 text-lg border-2 border-purple-200 rounded-2xl focus:border-main focus:outline-none transition-all duration-300 shadow-inner"
                                value={trackingId}
                                onChange={(e) => setTrackingId(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-12 py-2 bg-main text-white font-bold rounded-2xl hover:mainHover transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-3 text-lg"
                        >
                            <Package size={24} />
                            Track Now
                        </button>
                    </form>
                </div>

                {orderFound && (
                    <>
                        {/* Order Summary */}
                        <div className="bg-white rounded-3xl shadow-2xl p-4 mb-6 border border-purple-100">
                            <div className="flex flex-col md:flex-row justify-between items-start mb-2">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">Order {demoOrder.orderId}</h2>
                                    <p className="text-gray-600 text-lg">Placed on {demoOrder.orderDate}</p>
                                </div>
                                <div className="text-right">
                                    <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full text-lg font-bold shadow-lg ${getStatusColor(demoOrder.status)}`}>
                                        {demoOrder.status === "In Transit" && <Truck className="animate-pulse" size={24} />}
                                        {demoOrder.status === "Delivered" && <CheckCircle size={24} />}
                                        {demoOrder.status}
                                    </div>
                                    <p className="text-sm text-gray-500 mt-3">Est. Delivery: <span className="font-bold text-main">{demoOrder.estimatedDelivery}</span></p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center py-2 border-t-2 border-b-2 border-purple-100">
                                <div className="p-4 bg-purple-50 rounded-2xl">
                                    <p className="text-gray-600">Tracking ID</p>
                                    <p className="font-bold text-main text-xl">{demoOrder.trackingId}</p>
                                </div>
                                <div className="p-4 bg-blue-50 rounded-2xl">
                                    <p className="text-gray-600">Courier</p>
                                    <p className="font-bold text-secondary text-xl">{demoOrder.courier}</p>
                                </div>
                                <div className="p-4 bg-green-50 rounded-2xl">
                                    <p className="text-gray-600">Total</p>
                                    <p className="font-bold text-green-700 text-2xl">{demoOrder.total}</p>
                                </div>
                            </div>
                        </div>

                        {/* Interactive Timeline */}
                        <div className="bg-white rounded-3xl shadow-2xl p-10 mb-6 overflow-hidden border border-purple-100">
                            <h3 className="text-3xl font-bold text-center mb-12 bg-main bg-clip-text text-transparent">
                                Live Delivery Journey
                            </h3>

                            <div className="relative">
                                {/* Gradient Progress Line */}
                                <div className="absolute left-8 top-0 bottom-0 w-2 bg-main to-transparent rounded-full overflow-hidden">

                                    {/* <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-purple-600 to-pink-600 animate-pulse"></div> */}
                                </div>

                                <div className="space-y-10">
                                    {demoOrder.timeline.map((step, index) => {
                                        const Icon = step.icon;
                                        const isActive = step.completed;
                                        const isCurrent = index === demoOrder.timeline.findIndex(s => !s.completed);

                                        return (
                                            <div key={index} className="relative flex items-start gap-8 group">
                                                {/* Icon */}
                                                <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 ${isActive
                                                    ? "bg-main text-white scale-110 ring-8 ring-purple-200 ring-opacity-50"
                                                    : "bg-gray-100 text-gray-400 border-4 border-dashed border-gray-300"
                                                    } ${isCurrent ? "animate-ping" : ""}`}>
                                                    <Icon size={32} className={isActive ? "text-white" : "text-gray-500"} />
                                                    {isCurrent && (
                                                        <div className="absolute inset-0 rounded-full bg-main opacity-40 animate-ping"></div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className={`flex-1 pb-12 transition-all duration-500 ${isActive ? "translate-x-4" : ""}`}>
                                                    <div className={`p-4 rounded-3xl shadow-xl border-2 transition-all duration-500 ${isActive
                                                        ? "bg-gradient-to-r from-purple-50 to-pink-50 border-secondary shadow-secondary/20"
                                                        : "bg-gray-50 border-secondary/10"
                                                        } ${isCurrent ? "ring-4 ring-purple-200 animate-pulse" : ""}`}>
                                                        <h4 className={`text-xl font-bold flex items-center gap-4 ${isActive ? "text-gray-800" : "text-gray-400"
                                                            }`}>
                                                            {step.status}
                                                            {isCurrent && (
                                                                <span className="px-4 py-2 bg-main text-white text-sm rounded-full animate-pulse shadow-lg">
                                                                    Happening Now
                                                                </span>
                                                            )}
                                                            {step.status === "Delivered" && <CheckCircle className="text-green-500" size={24} />}
                                                        </h4>
                                                        <p className={`mt-2 text-lg ${isActive ? "text-gray-700" : "text-gray-400"}`}>
                                                            {step.date}
                                                        </p>
                                                    </div>

                                                    {/* Special Message */}
                                                    {step.status === "Out for Delivery" && isCurrent && (
                                                        <div className="mt-6 flex items-center gap-3 text-main font-bold text-lg animate-bounce">
                                                            <Truck size={28} className="text-main" />
                                                            <span>Your rider is on the way! Almost there!</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Products & Address */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-purple-100">
                                <h3 className="text-2xl font-bold mb-6 text-main">Items Ordered</h3>
                                {demoOrder.products.map((item, i) => (
                                    <div key={i} className="flex justify-between items-center py-5 border-b border-purple-100 last:border-0">
                                        <div>
                                            <p className="font-semibold text-gray-800 text-lg">{item.name}</p>
                                            <p className="text-sm text-gray-500">Quantity: {item.qty}</p>
                                        </div>
                                        <p className="font-bold text-main">{item.price}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-purple-100">
                                <h3 className="text-2xl font-bold mb-6 text-main">Delivery Address</h3>
                                <div className="space-y-4 text-lg">
                                    <p className="font-bold text-gray-800">{demoOrder.customer}</p>
                                    <p className="text-gray-700">{demoOrder.phone}</p>
                                    <p className="text-gray-700 leading-relaxed">{demoOrder.address}</p>
                                    <p className="text-sm text-secondary font-medium">
                                        Paid via <span className="font-bold">{demoOrder.paymentMethod}</span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {!orderFound && trackingId && (
                    <div className="text-center py-32">
                        <Package size={120} className="mx-auto text-gray-300 mb-6 animate-bounce" />
                        <p className="text-2xl text-gray-500">No order found. Please check your tracking number.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTrackingPage;