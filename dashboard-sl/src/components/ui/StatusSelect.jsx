import React from "react";
import { Loader2 } from "lucide-react";

const statusOptions = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];

const StatusSelect = ({ currentStatus, isUpdating, onChange }) => {
    const getOptionColor = (status) => {
        const colors = {
            pending: "text-yellow-700",
            processing: "text-blue-700",
            confirmed: "text-indigo-700",
            shipped: "text-purple-700",
            delivered: "text-green-700",
            cancelled: "text-red-700",
        };
        return colors[status] || "text-gray-700";
    };

    return (
        <div className="relative inline-block">
            {isUpdating ? (
                <div className="py-2 bg-gray-100 rounded-full flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Updating...</span>
                </div>
            ) : (
                <select
                    value={currentStatus}
                    onChange={onChange}
                    className="py-2 rounded-full text-sm font-semibold bg-white border-2 border-transparent hover:border-gray-300 focus:border-main outline-none cursor-pointer transition"
                >
                    {statusOptions.map((status) => (
                        <option key={status} value={status} className={getOptionColor(status)}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default StatusSelect;