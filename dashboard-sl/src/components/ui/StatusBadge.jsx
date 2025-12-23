import React from "react";

const StatusBadge = ({ status }) => {
    const colors = {
        pending: "bg-yellow-100 text-yellow-800",
        processing: "bg-blue-100 text-blue-800",
        confirmed: "bg-indigo-100 text-indigo-800",
        shipped: "bg-purple-100 text-purple-800",
        delivered: "bg-green-100 text-green-800",
        cancelled: "bg-red-100 text-red-800",
    };

    return (
        <span className={`px-4 py-2 rounded-full text-sm font-bold ${colors[status] || "bg-gray-100 text-gray-800"}`}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
    );
};

export default StatusBadge;