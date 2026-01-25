"use client";

import { useSelector } from "react-redux";
import {
  ShoppingBag,
  Heart,
  MapPin,
  Headphones,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import RecentOrders from "@/modules/user/dashboard/RecentOrders";

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const name = user?.user_name || "Customer";

  return (
    <div className="space-y-6">
      {/* WELCOME */}
      <div className="bg-white border rounded-xl p-6">
        <h1 className="text-2xl font-semibold">
          Welcome back, <span className="text-main">{name}</span>
        </h1>
        <p className="text-gray-600 mt-1 text-sm">
          Manage your orders, profile and preferences
        </p>
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickCard
          href="/user/dashboard/orders"
          icon={ShoppingBag}
          title="My Orders"
          desc="Track, return or reorder"
        />
        <QuickCard
          href="/user/dashboard/wishlist"
          icon={Heart}
          title="Wishlist"
          desc="Products you saved"
        />
        <QuickCard
          href="/user/dashboard/address"
          icon={MapPin}
          title="Address Book"
          desc="Manage delivery addresses"
        />
        <QuickCard
          href="/user/dashboard/support"
          icon={Headphones}
          title="Support"
          desc="Need help? Contact us"
        />
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Orders</h2>
          <Link
            href="/user/dashboard/orders"
            prefetch
            className="text-main font-medium flex items-center gap-1 hover:underline"
          >
            View all <ChevronRight size={18} />
          </Link>
        </div>

        <RecentOrders />
      </div>

      {/* ACCOUNT INFORMATION */}
      <div className="bg-white border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Account Information</h2>
          {/* <button className="text-main text-sm font-medium hover:underline">
            Edit profile
          </button> */}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoCard label="Full Name" value={user?.user_name} />
          <InfoCard label="Email" value={user?.email || "—"} />
          <InfoCard label="Phone" value={user?.phone || "—"} />
        </div>
      </div>
    </div>
  );
}

/* ----------------------------------
   SMALL INTERNAL COMPONENTS
---------------------------------- */

function QuickCard({ href, icon: Icon, title, desc }) {
  return (
    <Link
      href={href}
      prefetch
      className="group bg-white border rounded-xl p-5 hover:shadow-md transition
                 focus:outline-none focus:ring-2 focus:ring-main"
    >
      <Icon className="text-main" size={26} />
      <p className="font-medium mt-3 group-hover:text-main">{title}</p>
      <p className="text-sm text-gray-500">{desc}</p>
    </Link>
  );
}

function InfoCard({ label, value }) {
  return (
    <div className="border rounded-lg p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-medium mt-1">{value}</p>
    </div>
  );
}
