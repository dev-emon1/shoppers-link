"use client";

import { useSelector } from "react-redux";
import {
  ShoppingBag,
  Heart,
  MapPin,
  User,
  Headphones,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import RecentOrders from "@/modules/user/dashboard/RecentOrders";

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth);

  const name = user?.user_name || "Customer";

  return (
    <div className="space-y-8">
      {/* WELCOME CARD */}
      <div className="bg-white p-8 rounded-2xl shadow-sm border">
        <h1 className="text-3xl font-semibold">
          Welcome back, <span className="text-main">{name}</span>
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your orders, account information, addresses and preferences.
        </p>
      </div>

      {/* QUICK SHORTCUTS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        <Link href="/user/orders">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md cursor-pointer border transition group">
            <ShoppingBag className="text-main" size={28} />
            <p className="font-medium mt-3 group-hover:text-main">My Orders</p>
            <p className="text-gray-500 text-sm">Track, return or reorder</p>
          </div>
        </Link>

        <Link href="/wishlist">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md cursor-pointer border transition group">
            <Heart className="text-main" size={28} />
            <p className="font-medium mt-3 group-hover:text-main">Wishlist</p>
            <p className="text-gray-500 text-sm">
              Products you saved for later
            </p>
          </div>
        </Link>

        <Link href="/user/address">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md cursor-pointer border transition group">
            <MapPin className="text-main" size={28} />
            <p className="font-medium mt-3 group-hover:text-main">
              Address Book
            </p>
            <p className="text-gray-500 text-sm">Manage delivery addresses</p>
          </div>
        </Link>

        <Link href="/support">
          <div className="bg-white p-6 rounded-xl shadow hover:shadow-md cursor-pointer border transition group">
            <Headphones className="text-main" size={28} />
            <p className="font-medium mt-3 group-hover:text-main">Support</p>
            <p className="text-gray-500 text-sm">Need help? Contact us</p>
          </div>
        </Link>
      </div>

      {/* RECENT ORDERS */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Orders</h2>
          <Link
            href="/user/orders"
            className="text-main font-medium flex items-center gap-1"
          >
            View all <ChevronRight size={18} />
          </Link>
        </div>

        {/* IF no orders */}
        <div className="text-gray-500 text-center py-4">
          {/* No orders placed yet. */}
          <RecentOrders />
        </div>
      </div>

      {/* ACCOUNT INFORMATION */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border">
        <h2 className="text-xl font-semibold mb-4">Account Information</h2>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-xl border">
            <p className="text-gray-500 text-sm">Full Name</p>
            <p className="font-medium mt-1">{user?.user_name}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border">
            <p className="text-gray-500 text-sm">Email</p>
            <p className="font-medium mt-1">{user?.email || "—"}</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border">
            <p className="text-gray-500 text-sm">Phone</p>
            <p className="font-medium mt-1">{user?.phone || "—"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
