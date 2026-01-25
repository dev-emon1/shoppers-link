import React from "react";
import { Loader2 } from "lucide-react";

// স্ট্যাটাস পরিবর্তনের লজিক্যাল ফ্লো ডিফাইন করা হয়েছে
// const STATUS_FLOW = {
//     pending: ["confirmed", "cancelled"],
//     confirmed: ["processing", "cancelled"],
//     processing: ["shipped", "cancelled"],
//     shipped: ["delivered"],
//     delivered: [], // ডেলিভারড হয়ে গেলে আর পরিবর্তন করা যাবে না
//     cancelled: [], // ক্যান্সেল হয়ে গেলে আর পরিবর্তন করা যাবে না
// };
// স্ট্যাটাস পরিবর্তনের লজিক্যাল ফ্লো
const STATUS_FLOW = {
    // Pending অবস্থায় থাকতে 'confirmed' অথবা 'cancelled' করা যাবে
    pending: ["confirmed", "cancelled"],

    // Confirmed হয়ে গেলে আর 'cancelled' অপশন থাকবে না, শুধু 'processing' করা যাবে
    confirmed: ["processing"],

    // বাকি ফ্লো আগের মতোই থাকবে
    processing: ["shipped"],
    shipped: ["delivered"],
    delivered: [],
    cancelled: [],
};
const StatusSelect = ({ currentStatus, isUpdating, onChange }) => {

    const getOptionColor = (status) => {
        const colors = {
            pending: "text-yellow-700",
            confirmed: "text-indigo-700",
            processing: "text-blue-700",
            shipped: "text-purple-700",
            delivered: "text-green-700",
            cancelled: "text-red-700",
        };
        return colors[status] || "text-gray-700";
    };

    // বর্তমান স্ট্যাটাসের উপর ভিত্তি করে পরবর্তী অপশনগুলো ফিল্টার করা
    const availableOptions = STATUS_FLOW[currentStatus] || [];

    // ড্রপডাউন লক করার শর্ত (যদি ডেলিভারড বা ক্যান্সেলড হয়)
    const isLocked = availableOptions.length === 0;

    return (
        <div className="relative inline-block">
            {isUpdating ? (
                <div className="py-2 px-4 bg-gray-100 rounded-full flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-main" />
                    <span className="text-sm">Updating...</span>
                </div>
            ) : (
                <select
                    value={currentStatus}
                    onChange={onChange}
                    disabled={isLocked} // আর অপশন না থাকলে সিলেক্ট অপশনটি ডিজেবল থাকবে
                    className={`py-2 px-3 rounded-full text-sm font-bold bg-white border-2 border-gray-100 hover:border-gray-300 focus:border-main outline-none transition ${isLocked ? "cursor-not-allowed opacity-80" : "cursor-pointer"
                        } ${getOptionColor(currentStatus)}`}
                >
                    {/* বর্তমান স্ট্যাটাসটি সবসময় সিলেক্টেড হিসেবে থাকবে */}
                    <option value={currentStatus}>
                        {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                    </option>

                    {/* শুধুমাত্র পরবর্তী লজিক্যাল ধাপগুলো দেখাবে */}
                    {availableOptions.map((status) => (
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