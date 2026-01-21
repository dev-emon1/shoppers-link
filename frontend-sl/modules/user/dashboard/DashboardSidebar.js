"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  User,
  MapPin,
  LogOut,
  Heart,
  Headphones,
} from "lucide-react";
import useLogout from "../hooks/useLogout";

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { logout } = useLogout();

  const menu = [
    {
      label: "Dashboard",
      href: "/user/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      label: "My Orders",
      href: "/user/dashboard/orders",
      icon: <ShoppingBag size={18} />,
    },
    {
      label: "My Wishlist",
      href: "/user/dashboard/wishlist",
      icon: <Heart size={18} />,
    },
    {
      label: "Profile",
      href: "/user/dashboard/profile",
      icon: <User size={18} />,
    },
    {
      label: "Address Book",
      href: "/user/dashboard/address",
      icon: <MapPin size={18} />,
    },
    {
      label: "Support",
      href: "/user/dashboard/support",
      icon: <Headphones size={18} />,
    },
  ];

  return (
    <aside className="hidden md:block w-64 bg-white border-r h-full p-8">
      <h2 className="text-xl font-semibold mb-6">My Account</h2>

      <ul className="space-y-1">
        {menu.map((item) => (
          <li key={item.href}>
            <Link
              prefetch
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm 
              hover:bg-gray-100 transition
              ${
                pathname === item.href
                  ? "bg-main/10 text-main font-medium"
                  : "text-textPrimary"
              }`}
            >
              {item.icon}
              {item.label}
            </Link>
          </li>
        ))}

        <li className="pt-4 mt-4 border-t">
          <button
            onClick={logout}
            className="flex items-center w-full text-left gap-3 px-4 py-2 text-red-500 hover:bg-red-50 rounded-lg transition"
          >
            <LogOut size={18} /> Logout
          </button>
        </li>
      </ul>
    </aside>
  );
}
