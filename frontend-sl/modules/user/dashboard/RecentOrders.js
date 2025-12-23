"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { Calendar, CreditCard, ChevronRight } from "lucide-react";
import api from "@/core/api/axiosClient";
import { showToast } from "@/lib/utils/toast";

export default function RecentOrders() {
    const { user } = useSelector((state) => state.auth);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const statusColors = {
        delivered: "bg-green-100 text-green",
        processing: "bg-yellow-100 text-yellow",
        cancelled: "bg-red-100 text-red",
        pending: "bg-gray-100 text-gray-500",
    };

    useEffect(() => {
        const fetchOrders = async () => {
            if (!user?.id) return;
            try {
                const { data } = await api.get("/customer/order/list");
                const sorted = (data.data || [])
                    .sort(
                        (a, b) =>
                            new Date(b.created_at).getTime() -
                            new Date(a.created_at).getTime()
                    )
                    .slice(0, 5); // latest 5 orders
                setOrders(sorted);
            } catch (err) {
                console.error("Failed to fetch recent orders:", err);
                showToast("Failed to load recent orders.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [user]);

    if (loading)
        return <p className="text-gray-500 text-center mt-5">Loading recent orders...</p>;

    if (!orders.length)
        return (
            <p className="text-gray-500 text-center mt-5">
                You have no recent orders.
            </p>
        );

    return (
        <div className="space-y-2">
            {/* <h2 className="text-xl font-semibold">Recent Orders</h2> */}

            {orders.map((order) => (
                <div
                    key={order.unid}
                    className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition"
                >
                    <div className="flex items-center justify-between">
                        <h3 className="font-medium">{order.unid}</h3>
                        <span
                            className={`px-2 py-1 text-xs rounded-full font-medium ${statusColors[order.status.toLowerCase()] || "bg-gray-100 text-gray-500"
                                }`}
                        >
                            {order.status}
                        </span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-2 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                            <Calendar size={16} />
                            <span>{new Date(order.created_at).toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <CreditCard size={16} />
                            <span>৳ {order.total_amount}</span>
                        </div>

                        <div className="flex justify-end">
                            <Link
                                href={`/user/dashboard/orders/${order.unid}`}
                                className="flex items-center gap-1 text-main font-medium hover:underline"
                            >
                                View <ChevronRight size={14} />
                            </Link>
                        </div>
                    </div>

                    {/* Product thumbnails */}
                    {/* <div className="flex gap-2 mt-3">
                        {order.vendor_orders?.flatMap(v => v.items)?.map((item) => (
                            <Image
                                key={item.product_id}
                                src={item.image || "/placeholder.png"}
                                width={50}
                                height={50}
                                alt="product"
                                className="rounded-md border object-cover"
                            />
                        ))}
                    </div> */}
                </div>
            ))}
        </div>
    );
}
