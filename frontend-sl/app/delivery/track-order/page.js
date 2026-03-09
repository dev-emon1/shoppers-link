import { Search } from "lucide-react";

export default function TrackOrderPage() {
  return (
    <div className="bg-bgPage min-h-screen py-20">
      <div className="container max-w-xl text-center">
        <h1 className="text-3xl font-bold text-secondary mb-4">
          Track Your Order
        </h1>

        <p className="text-textSecondary mb-10">
          Enter your order ID to track the delivery status.
        </p>

        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Enter Order ID"
            className="flex-1 border border-border rounded-lg px-4 py-3"
          />

          <button className="px-6 py-3 bg-main text-white rounded-lg flex items-center gap-2">
            <Search size={18} />
            Track
          </button>
        </div>
      </div>
    </div>
  );
}
